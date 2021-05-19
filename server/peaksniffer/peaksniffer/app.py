import asyncio
import random
import re
from pathlib import Path
from typing import List
import os
import numpy as np
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

PATH = Path(__file__).resolve().parent

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_test_samples(n=1000):
    pairs = []

    for _ in range(n):
        model = random.sample(["GM12878", "IMR90"], k=1)[0]
        st1 = np.random.randint(1, 10000000)
        st2 = np.random.randint(1, 10000000)
        ed1 = np.random.randint(1, 10000000)
        ed2 = np.random.randint(1, 10000000)
        chr1 = random.sample(['chr1', 'chr2', 'chr3'], k=1)[0]
        chr2 = random.sample(['chr1', 'chr2', 'chr4'], k=1)[0]
        pairs.append({
            'Model': model,
            'GenomeRange1': f"{chr1}:{st1}-{ed1}",
            'GenomeRange2': f"{chr2}:{st2}-{ed2}",
            'Prob': np.random.random()
        })

    return pairs


#pairs = get_test_samples(100)

pairs = []
for model in ['GM12878', 'K562','Hela-S3']:
    for line in open("/public/home/yshen/deep_learning/webserve/"+str(model)+"/cluster_test_dbscanss.bed"):
        lines = line.strip().split()
        pairs.append({'Model': str(model), 'GenomeRange1':str(lines[0])+":"+str(lines[1])+"-"+str(lines[2]), 'GenomeRange2':str(lines[3])+":"+str(lines[4])+"-"+str(lines[5]),'Prob':str(lines[6])})      
models = [
    {
        "model": "GM12878",
        'size': len([pair for pair in pairs if pair['Model'] == "GM12878"]),
    },
    {
        "model": "K562",
        'size': len([pair for pair in pairs if pair['Model'] == "K562"]),
    },
    {
        "model": "Hela-S3",
        'size': len([pair for pair in pairs if pair['Model'] == "Hela-S3"]),
    },

]


async def predict_anchors(bed: List[dict], selected_models: List[str]) -> List[dict]:
    import numpy as np
    import os
    import traceback
    for row in bed:
        for model in [m for m in selected_models if m in ['GM12878', 'K562','Hela-S3']]:
         try:   
            for line in open("/public/home/yshen/deep_learning/webserve/"+str(model)+"/step1_model"+str(os.getpid())+"_predict.bed"):
                lines = line.strip().split()
                if row['GenomeRange'] == str(lines[0])+':'+str(lines[1])+'-'+str(lines[2]):
#                    print(row['GenomeRange'], model)
                    row[model] = lines[3][:7]
         except Exception as e:
            row[model] = str(e)
    try:
        for model in [m for m in selected_models if m in ['GM12878', 'K562','Hela-S3']]:
            os.remove("/public/home/yshen/deep_learning/webserve/"+str(model)+"/step1_model"+str(os.getpid())+"_predict.bed")
        os.remove('query_bed'+str(os.getpid())+'.bed')
    except Exception as e:
        os.remove('query_bed'+str(os.getpid())+'.bed')
    #await asyncio.sleep(2)
    return bed


async def predict_anchor_pairs(bedpe: List[dict], selected_models: List[str]) -> List[dict]:
    import numpy as np
    for row in bedpe:
        for model in [m['model'] for m in models]:
         try:
           for line in open("/public/home/yshen/deep_learning/webserve/"+str(model)+"/step2_predict_loop"+str(os.getpid())+".bed"):
                lines = line.strip().split()
                if row['GenomeRange1'] == str(lines[0])+':'+str(lines[1])+'-'+str(lines[2]) and row['GenomeRange2'] == str(lines[3])+':'+str(lines[4])+'-'+str(lines[5]):
#                    print(row['GenomeRange1'], model)
                    row[model] = lines[6][:7]
         except Exception as e:
             row[model] = str(e)
    try:  
        for model in [m for m in selected_models if m in ['GM12878', 'K562','Hela-S3']]:
            os.remove("/public/home/yshen/deep_learning/webserve/"+str(model)+"/step2_predict_loop"+str(os.getpid())+".bed")
        os.remove('query_bedpe'+str(os.getpid())+'.bed')
    except Exception as e:
        os.remove('query_bedpe'+str(os.getpid())+'.bed')
#           row[model] = np.random.random()
    #await asyncio.sleep(2)
    return bedpe


class Query(BaseModel):
    models: List[str] = None
    offset: int = 0
    limit: int = 0
    chroms: List[str] = None


@app.post('/query/predicted_pairs')
async def query_pairs(query: Query):
    models = query.models or []

    filtered_pairs = [pair for pair in pairs if pair['Model'] in models]

    res = filtered_pairs[query.offset: query.offset + query.limit]
    print("query", query)
    return res


@app.post("/download/predicted_pairs")
async def download_pairs(query: Query):
    models = query.models or []
    filtered_pairs = [pair for pair in pairs if pair['Model'] in models]
    res = filtered_pairs[query.offset: query.offset + query.limit]
    print("download", query)
    import io
    stream = io.StringIO()
    for pair in res:
        model = pair['Model']
        gr1 = pair['GenomeRange1']
        chr1, st1, ed1 = re.findall(r"(.*):(.*)-(.*)", gr1)[0]
        gr2 = pair['GenomeRange2']
        chr2, st2, ed2 = re.findall(r"(.*):(.*)-(.*)", gr2)[0]
        line = '\t'.join([chr1, st1, ed1, chr2, st2, ed2, str(pair['Prob']), model])
        stream.write(line + "\n")
    stream.flush()
    stream.seek(0)
    response = StreamingResponse(stream, media_type="text/txt")
    response.headers['Context-Disposition'] = "attachment; filename=loops.pair"

    return response


class PredictQuery(BaseModel):
    data: List[dict]
    models: List[str]


async def query_to_bed_file(bed):
    o = open('query_bed'+str(os.getpid())+'.bed', 'w')
    for row in bed:
        chr1, st1, ed1 = re.findall(r"(.*):(.*)-(.*)", row['GenomeRange'])[0]
#        print(chr1, st1, ed1)
        line = '\t'.join([chr1, st1, ed1])
        o.write(line+ '\n')
    o.close()
    from pathlib import Path
    return Path(o.name).resolve() 

@app.post('/predict/anchors')
async def predict_anchor(query: PredictQuery):
    import os  
    f = await query_to_bed_file(query.data)
    ids = str(os.getpid())

    envs = dict(os.environ.items())
    envs['PWD'] = "/public/home/yshen/deep_learning/webserve/GM12878"
    a = await asyncio.create_subprocess_shell(f"KERAS_BACKEND=tensorflow python charid_predict_step1.py -b {f} -id {ids}", env=envs, cwd=envs['PWD'])
    envs['PWD'] = "/public/home/yshen/deep_learning/webserve/K562"
    b = await asyncio.create_subprocess_shell(f"KERAS_BACKEND=tensorflow python charid_predict_step1.py -b {f} -id {ids}", env=envs, cwd=envs['PWD'])
    envs['PWD'] = "/public/home/yshen/deep_learning/webserve/Hela-S3"
    c  = await asyncio.create_subprocess_shell(f"KERAS_BACKEND=tensorflow python charid_predict_step1.py -b {f} -id {ids}", env=envs, cwd=envs['PWD'])
    await a.wait()
    await b.wait()
    await c.wait()
    bed = await predict_anchors(query.data, query.models)
    return bed

async def query_to_bedpe_file(bed):
    o = open('query_bedpe'+str(os.getpid())+'.bed', 'w')
    for row in bed:
        chr1, st1, ed1 = re.findall(r"(.*):(.*)-(.*)", row['GenomeRange1'])[0]
#        print(chr1, st1, ed1)
        chr2, st2, ed2 = re.findall(r"(.*):(.*)-(.*)", row['GenomeRange2'])[0]
        line = '\t'.join([chr1, st1, ed1, chr2, st2, ed2])
        o.write(line+ '\n')
    o.close()  
    from pathlib import Path
    return Path(o.name).resolve()



@app.post("/predict/anchor_pairs")
async def predict_anchor_pair(query: PredictQuery):
    import os
    f = await query_to_bedpe_file(query.data)
#    await f.wait()
    ids = str(os.getpid())
    envs = dict(os.environ.items())
    envs['PWD'] = "/public/home/yshen/deep_learning/webserve/GM12878"
    a = await asyncio.create_subprocess_shell(f"KERAS_BACKEND=tensorflow python charid_predict_step2.py -id {ids}", env=envs, cwd=envs['PWD'])
    envs['PWD'] = "/public/home/yshen/deep_learning/webserve/K562"
    b = await asyncio.create_subprocess_shell(f"KERAS_BACKEND=tensorflow python charid_predict_step2.py -id {ids}", env=envs, cwd=envs['PWD'])
    envs['PWD'] = "/public/home/yshen/deep_learning/webserve/Hela-S3"
    c  = await asyncio.create_subprocess_shell(f"KERAS_BACKEND=tensorflow python charid_predict_step2.py -id {ids}", env=envs, cwd=envs['PWD'])
    await a.wait()
    await b.wait()
    await c.wait()
    bedpe = await predict_anchor_pairs(query.data, query.models)
    return bedpe


@app.get("/models")
async def get_models():
    return models


@app.post("/view/loop")
async def view_loop(row: dict):
#    print(row['Model'])
#    with open(Path(PATH, "test_loop.jpeg"), 'rb') as wf:
#        img = wf.read()
    import os
    import PyPDF2
    chr1, st1, ed1 = re.findall(r"(.*):(.*)-(.*)", row['GenomeRange1'])[0]
    chr2, st2, ed2 = re.findall(r"(.*):(.*)-(.*)", row['GenomeRange2'])[0]
    model = row['Model']
    envs = dict(os.environ.items())
    envs['PWD'] = "/public/home/yshen/deep_learning/webserve/"+str(model)
    a = await asyncio.create_subprocess_shell(f"python visualization.py -g {chr1}:{st1}-{ed2}", env=envs, cwd=envs['PWD'])
#    python "/public/home/yshen/deep_learning/webserve/"+str(row['Model'])+"/visualization.py -g"+"\t"+str(chr1)+":"+str(st1)+"-"+str(ed2)
    await a.wait() 
    with open(Path(envs['PWD'], "example_"+str(chr1)+":"+str(st1)+"-"+str(ed2)+".jpeg"), 'rb') as wf:
        img = wf.read()
    os.remove("/public/home/yshen/deep_learning/webserve/"+str(model)+"/example_"+str(chr1)+":"+str(st1)+"-"+str(ed2)+".jpeg")
    return Response(content=img, media_type="image/jpeg")
#    os.remove("example_"+str(chr1)+":"+str(st1)+"-"+str(ed2)+".jpeg")

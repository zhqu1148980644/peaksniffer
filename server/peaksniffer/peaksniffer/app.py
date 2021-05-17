import asyncio
import random
import re
from pathlib import Path
from typing import List

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


pairs = get_test_samples(100)

models = [
    {
        "model": "GM12878",
        'size': len([pair for pair in pairs if pair['Model'] == "GM12878"]),
    },
    {
        "model": "IMR90",
        'size': len([pair for pair in pairs if pair['Model'] == "IMR90"]),
    }
]


async def predict_anchors(bed: List[dict], selected_models: List[str]) -> List[dict]:
    import numpy as np
    for row in bed:
        for model in [m['model'] for m in models]:
            row[model] = np.random.random()
    await asyncio.sleep(2)
    return bed


async def predict_anchor_pairs(bedpe: List[dict], selected_models: List[str]) -> List[dict]:
    import numpy as np
    for row in bedpe:
        for model in [m['model'] for m in models]:
            row[model] = np.random.random()
    await asyncio.sleep(2)
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
    for pair in filtered_pairs:
        model = pair['Model']
        gr1 = pair['GenomeRange1']
        chr1, st1, ed1 = re.findall(r"(.*?):(.*?)-(.*?)", gr1)[0]
        gr2 = pair['GenomeRange2']
        chr2, st2, ed2 = re.findall(r"(.*?):(.*?)-(.*?)", gr2)[0]
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

@app.post('/predict/anchors')
async def predict_anchor(query: PredictQuery):
    bed = await predict_anchors(query.data, query.models)
    return bed


@app.post("/predict/anchor_pairs")
async def predict_anchor_pair(query: PredictQuery):
    bedpe = await predict_anchor_pairs(query.data, query.models)
    return bedpe


@app.get("/models")
async def get_models():
    return models


@app.post("/view/loop")
async def view_loop(row: dict):
    print(row)
    with open(Path(PATH, "test_loop.jpeg"), 'rb') as wf:
        img = wf.read()
    return Response(content=img, media_type="image/jpeg")

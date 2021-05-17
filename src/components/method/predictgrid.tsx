import {useContext, useEffect, useState} from "react"
import {Box, Grid, Step, StepButton, Stepper, withStyles} from "@material-ui/core"
import axios from "axios";
import {Column} from "react-base-table";

import Predictdatagrid from "./predictdatagrid";
import {get_default_column, TabPanel} from "./utils";
import {API} from "../../index"


function genomeRangeColumn(column) {
  return {
    ...column,
    format: "genomeRange",
    minWidth: 100,
    width: 200,
    frozen: Column.FrozenDirection.LEFT,
    editable: true
  }
}

const _anchors_default_columns = [
  genomeRangeColumn(get_default_column('GenomeRange'))
]
const _anchor_pairs_default_columns = [
  genomeRangeColumn(get_default_column("GenomeRange1")),
  genomeRangeColumn(get_default_column("GenomeRange2")),
]


const anchors_default_data = [
  {
    GenomeRange: "chr1:1000-2000", id: "chr1:1000-2000"
  },
  {
    GenomeRange: "chr1:2000-3000", id: "chr1:2000-3000"
  },
  {
    GenomeRange: "chr1:3000-4000", id: "chr1:3000-4000"
  }
]

const anchor_pairs_default_data = [
  {
    GenomeRange1: "chr1:1000-2000", GenomeRange2: "chr1:1000-2000", id: "chr1:1000-2000|chr1:1000-2000"
  },
  {
    GenomeRange1: "chr1:2000-3000", GenomeRange2: "chr2:2000-3000", id: "chr1:2000-3000|chr2:2000-3000"
  },
  {
    GenomeRange1: "chr1:3000-4000", GenomeRange2: "chr2:3000-4000", id: "chr1:3000-4000|chr2:3000-4000"
  }
]

function anchor_id({GenomeRange}) {
  return GenomeRange
}

function anchor_pair_id({GenomeRange1, GenomeRange2}) {
  return `${GenomeRange1}|${GenomeRange2}`
}

function parse_anchors(text, columns) {
  const rows = []
  text.split("\n").forEach(r => {
    try {
      if (r) {
        rows.push({
          GenomeRange: r,
          id: r
        })
      }
    }
    catch (e) {
      console.log(e)
    }
  })
  return rows;
}

function parse_anchor_pairs(text, columns) {
  const rows = []
  text.split("\n").forEach(r => {
    try {
      if (r) {
        const [gr1, gr2] = r.split(/[\s,]+/)
        rows.push({
          GenomeRange1: gr1,
          GenomeRange2: gr2,
          id: `${gr1}|${gr2}`
        })
      }
    }
    catch (e) {
      console.log(e)
    }
  })
  return rows;
}


const styles = theme => ({
  controlPanel: {},
  dataGrid: {}
} as const)


const steps = {
  step1: "Predict anchor candidates",
  step2: "Predict anchor pairs",
  step3: "Visualize Loops",
}


function PredictGrid(props) {
  const {classes, theme} = props
  
  console.log("API", API)
  
  const [activeStep, setActiveStep] = useState(0);
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };
  const [models, setModels] = useState([])
  
  useEffect(() => {
    axios.get(`${API}/models`)
      .then((rsp) => {
        // console.log(rsp.data)
        setModels(rsp.data)
      })
      .catch((error) => {
        console.log(error.toJSON())
      })
      .then(() => {
      
      })
  }, [])
  
  
  const anchors_default_columns = [
    ..._anchors_default_columns,
    ...models.map(({model}) => get_default_column(model))
  ]
  
  const anchor_pairs_default_columns = [
    ..._anchor_pairs_default_columns,
    ...models.map(({model}) => get_default_column(model))
  ]
  
  return (
    <Box>
      <Stepper nonLinear activeStep={activeStep} style={{fontSize: "large"}}>
        {Object.entries(steps).map(([step, label], index) => (
          <Step key={step}>
            <StepButton onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <TabPanel value={activeStep} step={0}>
        <Grid container direction="column">
          <Predictdatagrid
            models={models}
            default_columns={anchors_default_columns}
            default_data={anchors_default_data}
            parseRows={parse_anchors}
            api={`${API}/predict/anchors`}
            next={() => setActiveStep(1)}
          />
        </Grid>
      </TabPanel>
      <TabPanel value={activeStep} step={1}>
        <Grid container direction="column">
          <Predictdatagrid
            models={models}
            default_columns={anchor_pairs_default_columns}
            default_data={anchor_pairs_default_data}
            parseRows={parse_anchor_pairs}
            api={`${API}/predict/anchor_pairs`}
            back={() => setActiveStep(0)}
            next={() => setActiveStep(2)}
          />
        </Grid>
      </TabPanel>
      <TabPanel value={activeStep} step={2}>
        <Grid container direction="column">
          <Box>Waiting for done.</Box>
        </Grid>
      </TabPanel>
    </Box>
  )
}

export default withStyles(styles, {withTheme: true})(PredictGrid)



import React, {useEffect, useState} from 'react';
import {Box, Button, ButtonGroup, Grid, Step, StepButton, Stepper, withStyles} from "@material-ui/core"
import axios from "axios";

import {TabPanel} from "./utils";
import {HeaderControl, ChipSelectionControl, SearchInput} from "./grid/control";
import Querydatagrid from "./querydatagrid";
import Viewer from "./grid/viwer";
import GetAppIcon from '@material-ui/icons/GetApp';

import TablePagination from '@material-ui/core/TablePagination';
import {API} from "../../index"
import {validateGenomeRange} from "./grid/renders"


const styles = theme => ({
  controlPanel: {},
  dataGrid: {}
} as const)


const steps = {
  step1: "Query",
  step2: "Visualize",
}


function QueryGrid(props) {
  const { classes, theme } = props
  
  const [activeStep, setActiveStep] = useState(0);
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };
  const [models, setModels] = useState([])
  const [genomeRange, setGenomeRange] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [page, setPage] = useState(0)
  const [data, setData] = useState([])
  const [viewingData, setViewingData] = useState(null)
  const [size, setSize] = useState(0)
  
  const allModels = models.map(({ model }) => model)
  const selectedModels = models.filter(({ selected }) => selected).map(({ model }) => model)
  
  console.log(models)
  
  useEffect(() => {
    axios.get(`${API}/models`)
      .then((rsp) => {
        // set models and numPage
        const newModels = rsp.data.map((model) => ({
          ...model,
          selected: true
        }))
        setModels(newModels)
      })
      .catch((error) => {
        console.log(error.toJSON())
      })
      .then(() => {
      })
  }, [])
  
  useEffect(() => {
    const info = {
      models: selectedModels,
      offset: Math.max(page * rowsPerPage, 0),
      limit: rowsPerPage,
      genomeRange: genomeRange
    }
    axios.post(`${API}/query/predicted_pairs`, info)
      .then((rsp) => {
        setData(rsp.data.data)
        setSize(rsp.data.size)
      })
      .catch((error) => {
        console.log(error.toJSON())
      })
      .then(() => {
      
      })
  }, [models, page, rowsPerPage, genomeRange])
  
  
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage);
    setPage(0)
  };
  
  
  const setSelectedModels = (items) => {
    // here must do deep copy
    const newModels = models.map(c => ({ ...c }))
    newModels.forEach(model => {
      model.selected = items.includes(model.model);
    })
    setModels(newModels)
  }
  
  const onDownLoad = () => {
    axios.post(`${API}/download/predicted_pairs`,
      {
        models: selectedModels,
        offset: Math.max(page * rowsPerPage, 0),
        limit: rowsPerPage,
        GenomeRange: genomeRange
      },
      {
        responseType: "blob"
      }
    )
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'predicted.pairs');
        document.body.appendChild(link);
        link.click();
      })
  }
  
  
  const leftModelSelectorControl = [
    // <div style={{width: "50%"}}>
    <ChipSelectionControl
      key={"selectModelBtn"}
      label={"Models"}
      items={allModels}
      activatedItems={selectedModels}
      setActivatedItems={setSelectedModels}
    />,
    // </div>,
    // <div style={{width: "50%"}}>
    <SearchInput
      key={"selectGenomeRangeBtn"}
      label="ChromRange"
      placeholder="chr1:1213214-124352354"
      defaultValue={genomeRange}
      validate={validateGenomeRange}
      onClick={setGenomeRange}
      children={undefined}
    />
    // </div>
  ]
  
  
  const rightDownLoadControl = (
    <ButtonGroup>
      <Button color="secondary" variant="contained" size="large" onClick={onDownLoad}>
        <GetAppIcon/>
        DownLoad
      </Button>
    </ButtonGroup>
  )
  
  const handleOnView = ({rowData}) => {
    // TODO why the reference data is not updated in here?
    setViewingData(rowData)
    setActiveStep(1)
  }
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
          <HeaderControl left={leftModelSelectorControl} right={rightDownLoadControl}/>
          <Querydatagrid default_data={data} handleOnView={handleOnView}/>
          <TablePagination
            count={size}
            page={page}
            onChangePage={handleChangePage}
            rowsPerPage={rowsPerPage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Grid>
      </TabPanel>
      <TabPanel value={activeStep} step={1}>
        <Box width={"85vw"} style={{textAlign: "center"}}>
          <Grid container direction="column" alignItems={"center"} justify={"center"}>
            <Viewer data={viewingData}/>
          </Grid>
        </Box>
      </TabPanel>
    </Box>
  )
}

export default withStyles(styles, {withTheme: true})(QueryGrid)


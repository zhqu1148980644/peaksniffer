import {useState} from "react"
import {
  Typography,
  withStyles,
  GridList,
  Box,
  Grid,
  Stepper,
  StepButton,
  Step,
} from "@material-ui/core"


import DataGrid from "./datagrid";


const styles = theme => ({
  controlPanel: {
  
  },
  dataGrid: {
  }
} as const)

function UploadButton(props) {
  return <div>Upload</div>
}

function PredictBox(props) {
  return <div>Predict</div>
}

function NextButton(props) {
  return <div>Next</div>
}


function PredictGrid(props) {
  const {classes, theme} = props
  const steps = [
    "Predict anchor candidates",
    "Predict anchor pairs",
    "Visualize Loops"
  ]
  const [activeStep, setActiveStep] = useState(0);
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };
  
  return (
    // <>
    //   <Stepper nonLinear activeStep={activeStep} style={{fontSize: "large"}}>
    //     {steps.map((label, index) => (
    //       <Step key={label}>
    //         <StepButton onClick={handleStep(index)}>
    //           {label}
    //         </StepButton>
    //       </Step>
    //     ))}
    //   </Stepper>
    //   <DataGrid/>
    //   <Grid container direction="column">
    //     <Grid container item className={classes.controlPanel} direction="row">
    //       <UploadButton/>
    //       <PredictBox/>
    //       <NextButton/>
    //     </Grid>
    //     <DataGrid/>
    //   </Grid>
    // </>
    <DataGrid/>
  )
}

export default withStyles(styles, {withTheme: true})(PredictGrid)
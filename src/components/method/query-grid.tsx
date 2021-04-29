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

import Skeleton from '@material-ui/lab/Skeleton';
import {useState} from "react"

function QueryGrid(props) {
  const steps = [
    "Query Loops",
    "Visualize Loops"
  ]
  const [activeStep, setActiveStep] = useState(0);

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };
  let v = [1, 2, 3, 4, 5, 6, 7, 8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8]
  return (
    <>
      <Stepper nonLinear activeStep={activeStep} style={{fontSize: "large"}}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <Grid container style={{justifyContent: 'space-between'}}>
        <Grid item xs={5}>
          {v.map(i => {
            return (<Skeleton animation="wave" />);
          })}
        </Grid>
        <Grid item xs={5}>
          {v.map(i => {
            return (<Skeleton animation="wave" />);
          })}
        </Grid>
      </Grid>

    </>
  )
}

export default QueryGrid;
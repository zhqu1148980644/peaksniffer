import {Box, Button, ButtonGroup, Grid} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {LinearIndeterminate} from "../../shared/utils";
import ZoomImage from "../../shared/ZoomImage";
import axios from "axios";
import {API} from "../../../index"
import {GenomeRangeRender} from "./renders";
import TextField from '@material-ui/core/TextField';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      fontSize: "17px",
      alignItems: "center",
      '& > *': {
        margin: theme.spacing(1),
        width: '20ch',
      },
    },
    image: {
      margin: theme.spacing(1),
      maxWidth: "100%",
      verticalAlign: "middle",
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[4],
    },
  }),
);


export default function Viewer(props) {
  const classes = useStyles();
  
  
  const {data} = props
  const [model, setModel] = useState("")
  const [gr1, setGr1] = useState("")
  const [gr2, setGr2] = useState("")
  const [loading, setLoading] = useState(false)
  const [imgUrl, setImgUrl] = useState(null)
  
  
  useEffect(() => {
    if (data) {
      setModel(data.Model)
      setGr1(data.GenomeRange1)
      setGr2(data.GenomeRange2)
      onView()
    }
  }, [data])
  
  useEffect(() => {
    onView()
  }, [model, gr1, gr2])
  
  const onView = () => {
    if (!model || !gr1 || !gr2) return
    setLoading(true)
    axios.post(
      `${API}/view/loop`,
      {
        Model: model,
        GenomeRange1: gr1,
        GenomeRange2: gr2
      },
      {responseType: "blob"}
    )
      .then((rsp) => {
        let reader = new window.FileReader();
        reader.readAsDataURL(rsp.data);
        reader.onload = function () {
          let imageDataUrl = reader.result;
          setImgUrl(imageDataUrl)
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .then(() => {
        setLoading(false)
      })
  }
  
  const onModelChange = (e) => {
    setModel(e.target.value)
  }
  
  const updateGr1 = (props, value) => {
    setGr1(value)
  }
  
  const updateGr2 = (props, value) => {
    setGr2(value)
  }
  // console.log(props.data, model, gr1, gr2)
  return (
    <Grid container direction="column">
      <Grid container direction="row" justify={'center'}>
        <Box>
          <form className={classes.root} autoComplete="off">
            <TextField id="model" label="Model" value={model} onChange={onModelChange}/>
            <GenomeRangeRender disableText={true} cellData={gr1} column={{updateCellData: updateGr1}}/>
            <GenomeRangeRender disableText={true} cellData={gr2} column={{updateCellData: updateGr2}}/>
          </form>
        </Box>
        <Box>
          <ButtonGroup>
            <Button color="secondary" variant="contained" size="large" onClick={onView}>VIEW</Button>
          </ButtonGroup>
        </Box>
      </Grid>
      <Box height={"10px"}>
        {loading && <LinearIndeterminate/>}
      </Box>
      <Box>
        {imgUrl && <ZoomImage className={classes.image} src={imgUrl} alt={"loop_img"}/>}
      </Box>
    </Grid>
  )
}

import {Box, Grid, Typography, Paper} from "@material-ui/core";
import {TabPanel} from "../utils";
import React, {useEffect, useState} from "react";
import {LinearIndeterminate} from "../../shared/utils";
import ZoomImage from "../../shared/ZoomImage";
import axios from "axios";
import {API} from "../../../index"



export default function Viewer(props) {
  const {data} = props
  const [loading, setLoading] = useState(true)
  const [imgUrl, setImgUrl] = useState(null)
  
  useEffect(() => {
    if (!data) return
    setLoading(true)
    axios.post(`${API}/view/loop`, data, {responseType: "blob"})
      .then((rsp) => {
        let reader = new window.FileReader();
        reader.readAsDataURL(rsp.data);
        reader.onload = function() {
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
  }, [data])
  const title = data ? `${data.Model} ${data.GenomeRange1} ${data.GenomeRange2}` : ""
  return (
    <Grid container direction="column">
      <Paper>
        <Typography variant={"h4"}>{title}</Typography>
      </Paper>
      <Box height={"10px"}>
        {data && loading && <LinearIndeterminate/>}
      </Box>
      <Box>
        {imgUrl && <ZoomImage src={imgUrl} alt={"loop_img"}/>}
      </Box>
    </Grid>
  )
}
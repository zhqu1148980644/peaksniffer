import React, { Fragment , useState, useEffect} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  Grid,
  Typography,
  Card,
  Button,
  Hidden,
  Box,
  withStyles,
  withWidth,
  isWidthUp,
  Paper
} from "@material-ui/core";
import {useMarkDown} from "../shared/fileutil"
import ReactMarkdown from "react-markdown";
import ZoomImage from "../shared/ZoomImage"

const styles = (theme) => ({
  image: {
    maxWidth: "100%",
    verticalAlign: "middle",
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
  },
  main: {
    [theme.breakpoints.up("md")]: {
      maxWidth: "none !important",
    },
    textAlign: "center",
  },
  contentBox: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    paddingTop: theme.spacing(2)
  },
  mdBox: {
    paddingBottom: theme.spacing(2),
  }
} as const);

function MethodInfo(props) {
  const {
    theme,
    classes,
    Title,
    ImgPath,
    MdPath,
  } = props;

  const mdText = useMarkDown(MdPath);

  return (
    <>
      <Grid container className={classes.main}>
        <Grid item xs={12}>
          <Typography variant={"h3"}>
            {Title}
          </Typography>
        </Grid>
        <Grid container item className={classes.contentBox}>
          <Grid item xs={12} md={6} className={classes.mdBox}>
            <Card>
              <ReactMarkdown className={"content"} children={mdText}></ReactMarkdown>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <ZoomImage
              src={process.env.PUBLIC_URL + ImgPath}
              className={classes.image}
              alt="header example"
            />
          </Grid>
        </Grid>

      </Grid>
    </>
  );
}



export default withWidth()(
  withStyles(styles, { withTheme: true })(MethodInfo)
);
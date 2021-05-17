import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }),
);

export function LinearIndeterminate() {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <LinearProgress color="secondary"/>
    </div>
  );
}


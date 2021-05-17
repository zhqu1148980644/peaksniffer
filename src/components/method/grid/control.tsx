import {createStyles, FormControl, Grid, Input, makeStyles, MenuItem, Select} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import Chip from "@material-ui/core/Chip";
import React from "react";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      padding: "0px 5px 0px 5px"
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      width: "100%",
    },
    chips: {
      display: 'flex',
      flexWrap: 'nowrap',
      overflow: "scroll"
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  }),
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


export function ChipSelectionControl(props) {
  const classes = useStyles();
  const {items, activatedItems, setActivatedItems, label} = props
  const handleChange = (e) => {
    setActivatedItems(e.target.value as string[])
  }
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-mutiple-chip-label">{label}</InputLabel>
      <Select
        labelId="demo-mutiple-chip-label"
        id="demo-mutiple-chip"
        multiple
        value={activatedItems}
        onChange={handleChange}
        input={<Input id="select-multiple-chip"/>}
        renderValue={(selected) => (
          <div className={classes.chips}>
            {(selected as string[]).map((value) => (
              <Chip key={value} label={value} className={classes.chip}/>
            ))}
          </div>
        )}
        MenuProps={MenuProps}
      >
        {items.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}


export default function HeaderControl(props) {
  const classes = useStyles();
  const {left, right} = props
  return (
    <Grid container direction="row" className={classes.container} alignItems="center" justify={"space-around"}>
      <Grid item xs={6}>
        {left && left}
      </Grid>
      <Grid container item xs={6} direction="row" alignItems="center" justify="space-around">
        {right && right}
      </Grid>
    </Grid>
  
  )
}

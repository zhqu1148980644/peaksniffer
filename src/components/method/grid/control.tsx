import React, { useState, useEffect }from "react";
import { createStyles, FormControl, Grid, Input, makeStyles, MenuItem, Select, Theme, TextField} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import Chip from "@material-ui/core/Chip";
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';


const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      padding: "0px 5px 0px 5px"
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      // width: "100%",
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


export function HeaderControl(props) {
  const classes = useStyles();
  const {left, right} = props
  return (
    <Grid container direction="row" className={classes.container} alignItems="center" justify={"space-between"}>
      <Grid container item xs={6} direction="row" alignItems="center" justify={"space-between"}>
        {left && left}
      </Grid>
      <Grid container item xs={6} direction="row-reverse" alignItems="center" justify="space-between">
        {right && right}
      </Grid>
    </Grid>
  
  )
}



const useSearchStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      height: "50px"
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);

export function SearchInput({label, placeholder, defaultValue, validate, onClick, children}) {
  const classes = useSearchStyles();
  const [data, setData] = useState(defaultValue)

  return (
    <Paper className={classes.root}>
      <IconButton className={classes.iconButton} aria-label="menu">
        <MenuIcon />
      </IconButton>
      <TextField
        label={"GenomeRange"}
        error={validate && data && !validate(data)}
        className={classes.input}
        placeholder={placeholder}
        defaultValue={data}
        onChange={e => setData(e.target.value)}
        variant="standard"
      />
      <IconButton type="submit" className={classes.iconButton} onClick={() => onClick(data)}>
        <SearchIcon />
      </IconButton>
      {
        children && (
          <>
            <Divider className={classes.divider} orientation="vertical" />
            {{
              children
            }}
          </>
        )
      }
    </Paper>
  );
}

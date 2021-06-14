import {Box} from "@material-ui/core";
import React from "react";
import {Column} from "react-base-table";

export function TabPanel(props) {
  const {children, value, step, ...other} = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== step}
      id={`wrapped-tabpanel-${step}`}
      aria-labelledby={`wrapped-tab-${step}`}
      {...other}
    >
      {
        <Box>
          {children}
        </Box>
      }
    </div>
  );
}

export function get_default_column(col) {
  return {
    key: col,
    dataKey: col,
    title: col,
    width: 120,
    minWidth: 70,
    maxWidth: 300,
    format: null,
    frozen: Column.FrozenDirection.NONE,
    resizable: true,
    sortable: true,
    hidden: false
  }
}

export function genomeRangeColumn(column, editable = true) {
  return {
    ...column,
    format: editable ? "genomeRange" : null,
    minWidth: 100,
    width: 200,
    frozen: Column.FrozenDirection.LEFT,
    editable: true
  }
}


export function splitGenomeRange(gr: string) {
	try {
    const [_, chrom, start, end] = gr.match("^(.*?):(\\d+)-(\\d+)$")
		return [chrom, parseInt(start), parseInt(end)]
	} catch (error) {
		return gr
	}
}


export function compareArrays(a, b) {
  let elA, elB, i, len; 
  for (i = 0, len = Math.min(a.length, b.length); i < len; i++) {               
    elA = a[i]
    elB = b[i];
    if (elA > elB) return 1;
    if (elA < elB) return -1;
  }
  return b.length - a.length;
};


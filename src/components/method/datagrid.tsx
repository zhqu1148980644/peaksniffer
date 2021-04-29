import React, {useState, useEffect, useRef} from "react";
import BaseTable, {
  Column,
  SortOrder,
  AutoResizer,
  unflatten,
  callOrReturn
} from "react-base-table"
import styled, {createGlobalStyle} from "styled-components"
import 'react-base-table/styles.css'
import Checkbox from '@material-ui/core/Checkbox';
import classnames from "classnames";
import {withStyles} from "@material-ui/core";
import {Overlay} from "react-overlays"
import {
  FormControl,
  Fab,
  TextField,
  Input,
  makeStyles,
  createStyles,
  MenuItem,
  Menu,
  Select,
  Grid,
  Button
} from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import NavigationIcon from '@material-ui/icons/Navigation';
import Chip from '@material-ui/core/Chip';
import InputLabel from '@material-ui/core/InputLabel';

const column_names = ["GenomeRange", "GM12878", "HELA", "K562", "IMR90"]
const column_defaults = ["chr1:1000-2000", "98%", "98%", "93%", "72%"]
let column_defaults_empty = ["", "", "", "", ""]
let default_column_data = {}
column_names.forEach((col, index) => {
  default_column_data[col] = column_defaults_empty[index]
})
default_column_data = Object.assign(default_column_data, {id: 0, parentId: null})

const columns = column_names.map(col => ({
  key: col,
  dataKey: col,
  title: col,
  width: 120,
  format: null,
  frozen: Column.FrozenDirection.NONE,
  minWidth: 70,
  resizable: true,
  maxWidth: 300,
  sortable: true,
  hidden: false
}))
columns[0] = Object.assign(columns[0],
  {
    frozen: Column.FrozenDirection.LEFT,
    format: "genomeRange",
    minWidth: 100
  })


console.log(columns)
const default_data = Array(100).fill(0).map((item, index) => {
  let row = {}
  column_names.forEach((col, index) => {
    row[col] = `${column_defaults[index]}`
  })
  return Object.assign(row, {id: `col-${index}`, parentId: null})
})

function stringRender({columns, className, cellData}) {
  console.log(columns)
  return <div className={className}>{cellData}</div>
}



class EditableGenomeRangeRender extends React.PureComponent<any, any> {
  handleClick = () => this.setState({editing : true})
  handleHide = () => this.setState({editing: false})
  handleChange = e => {
    this.setState({
      value: e.target.value,
      valid: this.validate(e.target.value)
    })
  }
  handleBlur = e => {
    const {column} = this.props
    const {updateCellData} = column
    updateCellData(this.props, e.target.value)
    this.handleHide()
  }
  validate = gr => {
    try {
      const [_, chrom, start, end, ...rest] = gr.match("^(.*?):(\\d+)-(\\d+)$")
      return true
    } catch (error) {
      return false
    }
  }
  
  state = {
    value: this.props.cellData,
    editing: false,
    valid: this.validate(this.props.cellData)
  }
  
  render() {
    console.log(this.props)
    const {editing, value} = this.state

    return (
      <CellContainer
        onDoubleClick={this.handleClick}
      >
        {!editing && this.state.valid && value}
        {!editing && !this.state.valid && (
          <TextField
            error
            disabled
            label={"Invalid range"}
            value={value}
          />
        )}
        {editing && (
          <TextField
            autoFocus
            error={!this.state.valid}
            label={this.state.valid ? "" : "Invalid range"}
            value={value}
            onChange={this.handleChange}
            onBlur={this.handleBlur}/>
        )}
      </CellContainer>
    )
  }
}


class HeaderSelectionCell extends React.PureComponent<any, any> {
  render() {
    const {column} = this.props
    const {selectionState, HeaderCellOnChange} = column
    return (
      <Checkbox
        indeterminate={selectionState === 0}
        checked={selectionState === 1}
        onChange={HeaderCellOnChange}
      />
    )
  }
}

class SelectionCell extends React.PureComponent<any, any> {
  _onChange = e => {
    const {rowData, rowIndex, column} = this.props
    const {CellOnChange} = column
    CellOnChange({selected: e.target.checked, rowData, rowIndex})
  }

  render() {
    const {rowData, column} = this.props
    const {selectedRowKeys, rowKey} = column
    const checked = selectedRowKeys.includes(rowData[rowKey])
    return (
      <Checkbox color="primary" checked={checked} onChange={this._onChange}/>
    )
  }
}


const renderers = {
  string: stringRender,
  genomeRange: EditableGenomeRangeRender
}

const CellContainer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
`

function Cell(cellProps) {
  const format = cellProps.column.format || 'string'
  const Renderer = cellProps.column.cellRenderer || renderers[format] || renderers.string
  return (
    <CellContainer>
      <Renderer {...cellProps}/>
    </CellContainer>
  )
}

const components = {
  TableCell: Cell,
}


const StyledTable = styled(BaseTable)`
  .row-selected {
    background-color: #e3e3e3;
  }
`
class SelectTable extends React.PureComponent<any, any> {
  constructor(props) {
    super(props)

    const {selectedRowKeys, defaultSelectedRowKeys} = props

    this.state = {
      selectedRowKeys: (selectedRowKeys !== undefined ? selectedRowKeys : defaultSelectedRowKeys) || []
    }
  }

  setSelectedRowKeys(rowKeys) {
    if (this.props.selectedRowKeys !== undefined) return
    this.setState({
      selectedRowKeys: [...rowKeys]
    })
  }

  _rowClassName = ({rowData, rowIndex}) => {
    const {rowClassName, rowKey} = this.props
    const {selectedRowKeys} = this.state
    const rowClass = rowClassName ? callOrReturn(rowClassName, {rowData, rowIndex}) : ""
    const key = rowData[rowKey]
    return [rowClass, selectedRowKeys.includes(key) && 'row-selected'].filter(Boolean).concat(' ')
  }

  selectionState = () => {
    const {selectedRowKeys} = this.state
    const {data} = this.props
    return (selectedRowKeys.length > 0
      && data.length > selectedRowKeys.length)
      ? 0
      : (selectedRowKeys.length == data.length ? 1 : -1)
  }

  _handleHeaderSelectChange = () => {
    const selectionState = this.selectionState()
    let selectedRowKeys
    if (selectionState >= 0) {
      selectedRowKeys = []
    } else {
      const {data, rowKey} = this.props
      selectedRowKeys = data.map(rowData => rowData[rowKey])
    }
    this.setSelectedRowKeys(selectedRowKeys)
  }

  _handleSelectChange = ({selected, rowData, rowIndex}) => {
    const selectedRowKeys = [...this.state.selectedRowKeys]
    const key = rowData[this.props.rowKey]
    // const {onRowsSelect, onSelectedRowsChange} = this.props

    if (selected) {
      if (!selectedRowKeys.includes(key)) selectedRowKeys.push(key)
    } else {
      const index = selectedRowKeys.indexOf(key)
      if (index > -1) {
        selectedRowKeys.splice(index, 1)
      }
    }
    // update internal states
    this.setSelectedRowKeys(selectedRowKeys)

    // notify outer space
    // if (onRowsSelect) {
    //   onRowSelect({selected, rowData, rowIndex})
    // }
    // if (onSelectedRowsChange) {
    //   onSelectedRowsChange(selectedRowKeys)
    // }
  }

  render() {
    const {
      columns,
      children,
      selectable,
      selectionColumnProps,
      ...rest
    } = this.props

    const {selectedRowKeys} = this.state
    const selectionState = this.selectionState()

    let _columns = []
    if (selectable) {
      const selectionColumn = {
        width: 40,
        flexShrink: 0,
        resizable: false,
        frozen: Column.FrozenDirection.LEFT,
        key: "__selection__",
        cellRenderer: SelectionCell,
        headerRenderer: HeaderSelectionCell,
        rowKey: this.props.rowKey,
        selectionState: selectionState,
        selectedRowKeys: selectedRowKeys,
        CellOnChange: this._handleSelectChange,
        HeaderCellOnChange: this._handleHeaderSelectChange,
        ...selectionColumnProps,
      }
      _columns = [selectionColumn]
    }
    console.log(_columns)
    return (
      <StyledTable
        {...rest}
        columns={[..._columns, ...columns]}
        rowClassName={this._rowClassName}
      />
    )
  }
}


const defaultSortState = {}
column_names.forEach(col => {
  defaultSortState[col] = null
})




const StyledFab = styled(Fab)`
  margin: 5px;
`

function ChromRangeInserter(props) {
  return (
    <FormControl fullWidth style={{flexDirection: "row", alignItems: "flex-end"}}>
      <StyledFab
        variant="extended"
        size="small"
        color="primary"
      >
        <AddIcon/>
      </StyledFab>
      <TextField style={{width: "100%"}}/>
    </FormControl>
  )
}

function BedEditor(props) {
  return (
    <FormControl>
      <StyledFab variant="extended" color="primary" size="small">
        <NavigationIcon/>
        Add ChromRanges
      </StyledFab>
      <TextField
        label="bedfile"
        multiline
        rows={3}
        variant="outlined"
      />
    </FormControl>
  )
}


const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 5px 0px 5px;
`

class FooterControl extends React.PureComponent<any, any> {
  
  render() {
    const {appendChromRanges, ...rest} = this.props
    return (
      <Footer>
        <ChromRangeInserter onChange={appendChromRanges} {...rest}/>
        <BedEditor onChange={appendChromRanges} {...rest}/>
      </Footer>
      )
  }
}


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


function Control(props) {
  const classes = useStyles();
  const {columns, setColumns} = props
  const handleChange =(e) => {
    setColumns(e.target.value as string[])
  }
  return (
    <Grid container direction="row" className={classes.container}>
      <Grid item xs={6}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-mutiple-chip-label">Columns</InputLabel>
          <Select
            labelId="demo-mutiple-chip-label"
            id="demo-mutiple-chip"
            multiple
            value={columns}
            onChange={handleChange}
            input={<Input id="select-multiple-chip" />}
            renderValue={(selected) => (
              <div className={classes.chips}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {column_names.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid container item xs={6} direction="row" alignItems="center" justify="flex-end">
        <Button color="secondary" variant="contained" size="large">
          PREDICT
        </Button>
        <Button color="primary" variant="contained" size="large">
          NEXT
        </Button>
      </Grid>
    </Grid>
    
  )
}

const Container = styled.div`
  width: 85vw;
  height: 100vh;
`
class DataGrid extends React.PureComponent<any, any> {
  constructor(props) {
    super(props);
    columns[0] = Object.assign(columns[0], {updateCellData: this.updateCellData})
    this.state = {
      data: default_data,
      sortState: defaultSortState,
      columns: columns.slice()
    }
  }
  
  onColumnSort = ({key, order}) => {
    const {data, sortState} = this.state
    const sortedData = [...data]
    sortedData.sort((row1, row2) => {
      const v1 = row1[key], v2 = row2[key]
      return order === "asc" ? (v1 <= v2 ? -1 : 1) : (v2 <= v1 ? -1 : 1);
    })
    this.setState({
      sortState: {
        ...sortState,
        [key]: sortState[key] === 'desc' ? null : order,
      },
      data: sortedData
    })
    console.log(sortedData, order, key)
  }

   updateCellData = ({rowIndex, column}, val) => {
       const {key} = column
       const {data} = this.state
       const newData = [...data]
       newData[rowIndex][key] = val
       this.setState({data: newData})
  }
  
  
  
  appendChromRanges = (rows: Array<any>) => {
    let curIndex = this.state.data.length
    const newData = rows.map(gr => {
      let id = curIndex
      curIndex += 1
      return {
        ...default_column_data,
        GenomeRange: gr,
        id: id,
      }
    })
    this.setState({data: [...this.state.data, ...newData]})
  }

  setActivatedColumns = (cols) => {
    const columns = this.state.columns.slice()
    columns.forEach(col => {
      const {key} = col
      if (cols.includes(key)) {
        col.hidden = false
      } else {
        col.hidden = true
      }
    })
    this.setState({columns: columns})
    console.log(columns)
  }
  
  render() {
    const {columns, data} = this.state
    const activatedColumns = columns.filter(({hidden}) => !hidden).map(({key}) => key)
    return (
      <Container>
        <Control columns={activatedColumns} setColumns={this.setActivatedColumns}>
        </Control>
        <AutoResizer>
          {({width, height}) => (
            <SelectTable
              fixed
              width={width}
              height={height}
              columns={columns}
              data={data}
              components={components}
              {...this.props}
              rowKey="id"
              selectable={true}
              sortState={this.state.sortState}
              onColumnSort={this.onColumnSort}
              footerHeight={250}
              footerRenderer={() => <FooterControl appendChromRanges={this.appendChromRanges}/>}
            />
          )}
        </AutoResizer>
      </Container>
    )
  }
}

export default DataGrid;


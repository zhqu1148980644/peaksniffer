import React, {useEffect, useState} from "react";
import {Box, ButtonGroup, IconButton, TextField} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import styled from "styled-components"
import DeleteIcon from '@material-ui/icons/Delete';
import ImageIcon from '@material-ui/icons/Image';

const CellContainer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
`

function stringRender({columns, className, cellData}) {
  // console.log(columns)
  return <div className={className}>{cellData}</div>
}


function EditableRender(props) {
  const {disableText} = props
  const [value, setValue] = useState(props.cellData)
  const [editing, setEditing] = useState(false)
  
  useEffect(() => {
    setValue(props.cellData)
  }, [props.cellData])
  const valid = props.validate(value)
  
  console.log(value, editing, valid)
  
  const handleClick = () => {
    setEditing(true)
  }
  
  const handleHide = () => {
    setEditing(false)
  }
  
  const handleChange = e => {
    setValue(e.target.value)
    // handleHide()
  }
  
  const handleBlur = e => {
    const {column} = props
    const {updateCellData} = column
    updateCellData(props, e.target.value)
    handleHide()
  }
  
  
  // console.log(this.props)
  
  return (
    <CellContainer
      onDoubleClick={handleClick}
    >
      {!disableText && !editing && valid && value}
      {!disableText && !editing && !valid && (
        <TextField
          error
          disabled
          label={"Invalid range"}
          value={value}
        />
      )}
      {(editing || disableText) && (
        <TextField
          autoFocus
          error={!valid}
          label={valid ? "GenomeRange" : "Invalid range"}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}/>
      )}
    </CellContainer>
  )
}


export function GenomeRangeRender(props) {
  const validate = (gr) => {
    try {
      const [_, chrom, start, end] = gr.match("^(.*?):(\\d+)-(\\d+)$")
      return true
    } catch (error) {
      return false
    }
  }
  return <EditableRender validate={validate} {...props}/>
}


function InfoRender(props) {
  const {column} = props
  const {onView} = column
  return (
    <Box>
      <ButtonGroup>
        <IconButton onClick={() => onView(props)}>
          <ImageIcon/>
        </IconButton>
      </ButtonGroup>
    </Box>
  )
}

const renderers = {
  string: stringRender,
  genomeRange: GenomeRangeRender,
  info: InfoRender
}


function Cell(cellProps) {
  const format = cellProps.column.format || 'string'
  const Renderer = cellProps.column.cellRenderer || renderers[format] || renderers.string
  return (
    <CellContainer>
      <Renderer {...cellProps}/>
    </CellContainer>
  )
}

export const CellComponents = {
  TableCell: Cell,
}

export class HeaderSelectionCell extends React.PureComponent<any, any> {
  render() {
    const {column} = this.props
    const {selectionState, HeaderCellOnChange, HeaderCellOnDelete} = column
    return (
      <Box>
        <Checkbox
          indeterminate={selectionState === 0}
          checked={selectionState === 1}
          onChange={HeaderCellOnChange}
        />
        <IconButton aria-label={"delete"} onClick={HeaderCellOnDelete}>
          <DeleteIcon/>
        </IconButton>
      </Box>
    )
  }
}

export class SelectionCell extends React.PureComponent<any, any> {
  onChange = e => {
    const {rowData, rowIndex, column} = this.props
    const {CellOnChange} = column
    CellOnChange({selected: e.target.checked, rowData, rowIndex})
  }
  
  render() {
    const {rowData, column} = this.props
    const {selectedRowKeys, rowKey} = column
    const checked = selectedRowKeys.includes(rowData[rowKey])
    return (
      <Box>
        <Checkbox style={{marginRight: "auto"}} color="primary" checked={checked} onChange={this.onChange}/>
      </Box>
    )
  }
}

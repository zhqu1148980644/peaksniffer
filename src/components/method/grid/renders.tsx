import React from "react";
import {Box, Button, ButtonGroup, IconButton, TextField} from "@material-ui/core";
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


class EditableRender extends React.PureComponent<any, any> {
  state = {
    value: this.props.cellData,
    editing: false,
    valid: this.validate(this.props.cellData)
  }
  
  handleClick = () => this.setState({editing: true})
  
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
  
  validate(gr) {
    return true
  }
  
  render() {
    // console.log(this.props)
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

class GenomeRangeRender extends EditableRender {
  validate(gr) {
    try {
      const [_, chrom, start, end] = gr.match("^(.*?):(\\d+)-(\\d+)$")
      return true
    } catch (error) {
      return false
    }
  }
}

class GenomeRangePairRender extends EditableRender {
  validate(gr) {
    try {
      const [_, chrom1, start1, end1, chrom2, start2, end2] = gr.match("^(.*?):(\\d+)-(\\d+)|(.*?):(\\d+)-(\\d+)$")
      return true
    } catch (error) {
      return false
    }
  }
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
  genomeRangePair: GenomeRangePairRender,
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

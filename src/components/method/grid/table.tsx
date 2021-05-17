import BaseTable, {callOrReturn, Column} from "react-base-table";
import React, {useState} from "react";
import {HeaderSelectionCell, SelectionCell} from "./renders";
import styled from "styled-components"

const StyledTable = styled(BaseTable)`
  .row-selected {
    background-color: #e3e3e3;
  }
`

export default function SelectTable(props) {
  
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  
  
  const rowClassName = ({rowData, rowIndex}) => {
    const {rowClassName, rowKey} = props
    const rowClass = rowClassName ? callOrReturn(rowClassName, {rowData, rowIndex}) : ""
    const key = rowData[rowKey]
    return [rowClass, selectedRowKeys.includes(key) && 'row-selected'].filter(Boolean).concat(' ')
  }
  
  const getSelectionState = () => {
    return (selectedRowKeys.length > 0
      && props.data.length > selectedRowKeys.length)
      ? 0
      : (selectedRowKeys.length == props.data.length ? 1 : -1)
  }
  
  const handleHeaderSelectChange = () => {
    const selectionState = getSelectionState()
    let selectedRowKeys
    if (selectionState >= 0) {
      selectedRowKeys = []
    } else {
      const {data, rowKey} = props
      selectedRowKeys = data.map(rowData => rowData[rowKey])
    }
    setSelectedRowKeys(selectedRowKeys)
  }
  
  const handleSelectChange = ({selected, rowData, rowIndex}) => {
    const newSelectedRowKeys = [...selectedRowKeys]
    const key = rowData[props.rowKey]
    // const {onRowsSelect, onSelectedRowsChange} = this.props
    
    if (selected) {
      if (!newSelectedRowKeys.includes(key)) newSelectedRowKeys.push(key)
    } else {
      const index = newSelectedRowKeys.indexOf(key)
      if (index > -1) {
        newSelectedRowKeys.splice(index, 1)
      }
    }
    // update internal states
    setSelectedRowKeys(newSelectedRowKeys)
    
    // notify outer space
    // if (onRowsSelect) {
    //   onRowSelect({selected, rowData, rowIndex})
    // }
    // if (onSelectedRowsChange) {
    //   onSelectedRowsChange(selectedRowKeys)
    // }
  }
  const handleHeaderDelete = () => {
    props.deleteRowKeys(selectedRowKeys)
  }
  
  const {
    columns,
    children,
    selectable,
    selectionColumnProps,
    ...rest
  } = props
  
  
  let _columns = []
  if (selectable) {
    const selectionColumn = {
      width: 120,
      className: "selectionColumnCell",
      resizable: false,
      frozen: Column.FrozenDirection.LEFT,
      key: "__selection__",
      cellRenderer: SelectionCell,
      headerRenderer: HeaderSelectionCell,
      rowKey: props.rowKey,
      selectionState: getSelectionState(),
      selectedRowKeys: selectedRowKeys,
      CellOnChange: handleSelectChange,
      HeaderCellOnChange: handleHeaderSelectChange,
      HeaderCellOnDelete: handleHeaderDelete,
      ...selectionColumnProps,
    }
    _columns = [selectionColumn]
  }
  return (
    <StyledTable
      {...rest}
      columns={[..._columns, ...columns]}
      rowClassName={rowClassName}
    />
  )
}


import React, {useEffect, useState} from "react";
import {AutoResizer} from "react-base-table"
import {Box, Button, ButtonGroup} from "@material-ui/core"
import styled from "styled-components"
import 'react-base-table/styles.css'
import axios from "axios";
import {useSnackbar, VariantType} from 'notistack';


import {CellComponents} from "./grid/renders";
import {HeaderControl, ChipSelectionControl, SearchInput} from "./grid/control";
import FooterControl from "./grid/footer";
import SelectTable from "./grid/table";
import {LinearIndeterminate} from "../shared/utils";


const Container = styled.div`
  width: 85vw;
  height: 75vh;
`

let id_set = new Set()

function Predictdatagrid(props) {
  
  const {default_columns, default_data, parseRows} = props
  const [columns, setColumns] = useState(default_columns)
  const [data, setData] = useState(default_data)
  const [sortState, setSortState] = useState({})
  
  const {enqueueSnackbar} = useSnackbar();
  const [loading, setLoadling] = useState(false)
  
  useEffect(() => {
    const newColumns = default_columns.map((column) => ({
      ...column,
      updateCellData: updateCellData
    }))
    
    setColumns(newColumns)
  }, [default_columns])
  
  useEffect(() => {
    data.forEach(row => id_set.add(row['id']))
    console.log(id_set)
  }, [default_data])
  
  const allColumns = columns.map(({key}) => key)
  const activatedColumns = columns.filter(({hidden}) => !hidden).map(({key}) => key)
  const updateCellData = ({rowIndex, column}, val) => {
    const {key} = column
    const newData = [...data]
    newData[rowIndex][key] = val
    setData(newData)
  }
  
  const deleteRowKeys = (selectedRowKeys) => {
    selectedRowKeys.forEach((key) => id_set.delete(key))
    console.log(selectedRowKeys, id_set)
    const newData = [...data.filter(({id}) => id_set.has(id))]
    setData(newData)
  }
  
  const handleClickVariant = (variant: VariantType) => () => {
    enqueueSnackbar('The prediction request is submitted, please wait!', {variant});
  }
  
  const onColumnSort = ({key, order}) => {
    const sortedData = [...data]
    sortedData.sort((row1, row2) => {
      const v1 = row1[key], v2 = row2[key]
      return order === "asc" ? (v1 <= v2 ? -1 : 1) : (v2 <= v1 ? -1 : 1);
    })
    setSortState({
      ...sortedData, [key]: sortState[key] == "desc" ? null : order
    })
    setData(sortedData)
  }
  
  const appendRows = (text: string) => {
    const rows = parseRows(text)
    let newData = []
    rows.forEach((row) => {
      const row_id = row['id']
      if (!id_set.has(row_id)) {
        id_set.add(row_id)
        newData.push(row)
      }
    })
    setData([...data, ...newData])
  }
  
  const setActivatedColumns = (cols) => {
    // here must do deep copy
    const newColumns = columns.map(c => ({...c}))
    newColumns.forEach(col => {
      const {key} = col
      col.hidden = !cols.includes(key);
    })
    setColumns(newColumns)
  }
  
  
  const predict = () => {
    setLoadling(true)
    axios.post(props.api, {
      data: data,
      models: activatedColumns
    })
      .then((rsp) => {
        const predicted_data = rsp.data;
        setData(predicted_data)
      })
      .catch((error) => {
        console.log(error.toJSON())
      })
      .then(() => {
        setLoadling(false)
      })
    handleClickVariant('success')()
  }
  // control
  const leftColumnSelectorControl = (
    <ChipSelectionControl
      items={allColumns}
      activatedItems={activatedColumns}
      setActivatedItems={setActivatedColumns}
      label={"Columns"}
    />
  )
  const {back, next} = props
  const rightButtonsControl = [
    <Button key={"prevBtn"} color="secondary" variant="contained" size="large" onClick={predict}>
      PREDICT
    </Button>
    ,
    <ButtonGroup key={"nextBtn"}>
      <Button disabled={back === undefined} color="primary" variant="contained" size="large" onClick={back}>
        BACK
      </Button>
      <Button color="primary" variant="contained" size="large" onClick={next}>
        NEXT
      </Button>
    </ButtonGroup>
  ]
  
  return (
    <Container>
      <HeaderControl
        left={leftColumnSelectorControl}
        right={rightButtonsControl}
        {...props}
      />
      <Box height={"10px"}>
        {loading && <LinearIndeterminate/>}
      </Box>
      <AutoResizer>
        {({width, height}) => (
          <SelectTable
            fixed
            width={width}
            height={height}
            columns={columns}
            data={data}
            components={CellComponents}
            {...props}
            rowKey="id"
            selectable={true}
            sortState={sortState}
            onColumnSort={onColumnSort}
            footerHeight={200}
            footerRenderer={() => <FooterControl submit={appendRows}/>}
            deleteRowKeys={deleteRowKeys}
          />
        )}
      </AutoResizer>
    </Container>
  )
}

export default Predictdatagrid;


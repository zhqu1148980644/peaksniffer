import React, {useEffect, useState} from "react";
import {genomeRangeColumn, get_default_column} from "./utils";
import {AutoResizer, Column} from "react-base-table";
import {Box} from "@material-ui/core";
import {LinearIndeterminate} from "../shared/utils";
import SelectTable from "./grid/table";
import {CellComponents} from "./grid/renders";
import styled from "styled-components"

const _default_columns = [
  {...get_default_column("Model"), frozen: Column.FrozenDirection.LEFT},
  genomeRangeColumn(get_default_column("GenomeRange1"), false),
  genomeRangeColumn(get_default_column("GenomeRange2"), false),
  get_default_column("Prob"),
  {...get_default_column("Info"), format: "info"}
]

const Container = styled.div`
  width: 85vw;
  height: 60vh;
`

function Footer(props) {
  return (
    <div></div>
  )
}

export default function Querydatagrid(props) {
  const {default_data} = props
  const [data, setData] = useState([])
  const [sortState, setSortState] = useState({})
  
  useEffect(() => {
    const newData = default_data.map(row => ({
      ...row,
      id: `${row.Model}|${row.GenomeRange1}|${row.GenomeRange2}`
    }))
    setData(newData)
  }, [default_data])
  
  const deleteRowKeys = (selectedRowKeys) => {
    const newData = [...data.filter(({id}) => !selectedRowKeys.includes(id))]
    setData(newData)
  }
  
  const columns = _default_columns.map(column => ({
    ...column,
    onView: props.handleOnView
  }))
  
  
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
  
  
  return (
    <Container>
      <Box height={"10px"}>
        {!data && <LinearIndeterminate/>}
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
            footerHeight={50}
            footerRenderer={() => <Footer/>}
            deleteRowKeys={deleteRowKeys}
          />
        )}
      </AutoResizer>
    </Container>
  )
}





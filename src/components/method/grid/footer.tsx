import {Fab, FormControl, TextField} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import NavigationIcon from "@material-ui/icons/Navigation";
import React, {useState} from "react";
import styled from "styled-components"

const StyledFab = styled(Fab)`
  margin: 5px;
`

function ChromRangeInserter({submit}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [value, setValue] = useState("")
  return (
    <FormControl fullWidth style={{flexDirection: "row", alignItems: "flex-end"}}>
      <StyledFab
        variant="extended"
        size="small"
        color="primary"
        onClick={() => submit(value)}
      >
        <AddIcon/>
      </StyledFab>
      <TextField
        style={{width: "100%"}}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </FormControl>
  )
}

function BedEditor({submit}) {
  const [value, setValue] = useState("")
  return (
    <FormControl>
      <StyledFab variant="extended" color="primary" size="small" onClick={() => submit(value)}>
        <NavigationIcon/>
        Add ChromRanges
      </StyledFab>
      <TextField
        label="bedfile"
        multiline
        rows={3}
        variant="outlined"
        value={value}
        onChange={(e) => setValue(e.target.value)}
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


function FooterControl(props) {
  
  return (
    <Footer>
      <BedEditor {...props}/>
    </Footer>
  )
}

export default FooterControl
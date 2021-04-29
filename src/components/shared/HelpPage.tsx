import {useState, useEffect} from "react"
import ReactMarkdown from "react-markdown"
import {Card} from "@material-ui/core"
import { useMarkDown } from "./fileutil"

function HelpPage(props) {
  const mdText = useMarkDown(props.MdPath)
  return (
    <ReactMarkdown children={mdText}/>
  )
}


export default HelpPage
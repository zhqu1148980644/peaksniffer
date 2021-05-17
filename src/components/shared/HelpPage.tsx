import ReactMarkdown from "react-markdown"
import {useMarkDown} from "./fileutil"

function HelpPage(props) {
  const mdText = useMarkDown(props.MdPath)
  return (
    <ReactMarkdown children={mdText}/>
  )
}


export default HelpPage
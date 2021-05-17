import {useEffect, useState} from "react"
import axios from "axios";
import {createWriteStream} from "fs";


export function useMarkDown(mdpath: string) {
  
  const [mdText, setMdText] = useState("# Loading...")
  
  useEffect(() => {
    async function readMarkdown() {
      let rsp = await fetch(process.env.PUBLIC_URL + mdpath);
      setMdText(await rsp.text());
    }
    
    readMarkdown();
  }, [mdpath])
  
  return mdText
}




export default {useMarkDown}
import React from 'react'
import { transformImage } from '../../lib/features'

const RenderAttachment = (file, url) => {
  switch(file) {
    case "video": 
    <video src={url} width={"200px"}/>
    break

    case "image":
    <img src={transformImage(url)} alt='attachment'/>

  }
}

export default RenderAttachment
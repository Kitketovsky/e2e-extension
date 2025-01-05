import styleText from "data-text:./thesaurus.css"
import type { PlasmoGetInlineAnchor, PlasmoGetStyle } from "plasmo"
import { useEffect, useState } from "react"

import { MSG_TYPES } from "./msg-types"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => document.body

const Thesaurus = () => {
  const [title, setTitle] = useState("E2E")

  useEffect(() => {
    function onWordDataReceived(message) {
      if (message.type === MSG_TYPES.WORD_THESAURUS) {
        setTitle(message.word)
      }
    }

    chrome.runtime.onMessage.addListener(onWordDataReceived)

    return () => {
      chrome.runtime.onMessage.removeListener(onWordDataReceived)
    }
  }, [])

  return <button>{title}</button>
}

export default Thesaurus

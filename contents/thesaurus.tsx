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
  const [wordData, setWordData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    function onWordDataReceived(message) {
      if (message.type === MSG_TYPES.WORD_FETCH_SUCCESS) {
        console.log("thesaurus", message)

        setError(null)
        setWordData(message.data)
      }

      if (message.type === MSG_TYPES.WORD_FETCH_FAIL) {
        setWordData(null)
        setError(message.error)
      }
    }

    chrome.runtime.onMessage.addListener(onWordDataReceived)

    return () => {
      chrome.runtime.onMessage.removeListener(onWordDataReceived)
    }
  }, [])

  if (!wordData) {
    return null
  }

  if (error) {
    return <button style={{ color: "red" }}>{JSON.stringify(error)}</button>
  }

  return <button>{JSON.stringify(wordData)}</button>
}

export default Thesaurus

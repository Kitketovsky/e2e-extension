import styleText from "data-text:./thesaurus.css"
import type { PlasmoGetInlineAnchor, PlasmoGetStyle } from "plasmo"
import { useEffect, useState } from "react"

import { ErrorMessage } from "./components/ErrorMessage"
import { Suggestions } from "./components/Suggestions"
import { MSG_TYPES } from "./msg-types"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

// FIXME: it's not positioned absolutely

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => document.body

const Thesaurus = () => {
  const [wordData, setWordData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[] | null>(null)

  useEffect(() => {
    function onWordDataReceived(message) {
      if (message.type === MSG_TYPES.WORD_FETCH_SUCCESS) {
        setError(null)
        setSuggestions(null)
        setWordData(message.data)
      }

      if (message.type === MSG_TYPES.WORD_SUGGESTIONS) {
        setError(null)
        setSuggestions(null)
        setSuggestions(message.data)
      }

      if (message.type === MSG_TYPES.WORD_FETCH_FAIL) {
        setWordData(null)
        setSuggestions(null)
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

  if (suggestions) {
    return <Suggestions suggestions={suggestions} />
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  return (
    <div>
      <span>{JSON.stringify(wordData)}</span>
    </div>
  )
}

export default Thesaurus

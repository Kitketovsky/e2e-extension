import tailwindCssText from "data-text:~style.css"
import type { PlasmoGetInlineAnchor, PlasmoGetStyle } from "plasmo"
import { useEffect, useState } from "react"

import { MSG_TYPES } from "../../const/msg-types"
import { ErrorMessage } from "./error-message"
import { Suggestions } from "./suggestions"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = tailwindCssText
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

  if (suggestions) {
    return <Suggestions suggestions={suggestions} />
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  if (wordData) {
    return (
      <div className="bg-white text-black p-4 rounded-xl z-50 flex fixed top-32 right-8">
        <span>{JSON.stringify(wordData)}</span>
      </div>
    )
  }

  return null
}

export default Thesaurus

import tailwindCssText from "data-text:~style.css"
import type { PlasmoGetStyle } from "plasmo"
import { useEffect, useState } from "react"

import { MSG_TYPES } from "../../const/msg-types"
import { Content } from "./components/content"
import { ErrorMessage } from "./components/error-message"
import { Overlay } from "./components/overlay"
import { Suggestions } from "./components/suggestions"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = tailwindCssText
  return style
}

const Thesaurus = () => {
  const [open, setOpen] = useState(false)

  const [wordData, setWordData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[] | null>(null)

  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  )

  useEffect(() => {
    function resetData() {
      setWordData(null)
      setError(null)
      setSuggestions(null)
      setPosition(null)
    }

    function onWordDataReceived(message) {
      resetData()

      setOpen(true)
      setPosition(message.position)

      if (message.type === MSG_TYPES.WORD_FETCH_SUCCESS) {
        setWordData(message.data)
      }

      if (message.type === MSG_TYPES.WORD_SUGGESTIONS) {
        setSuggestions(message.data)
      }

      if (message.type === MSG_TYPES.WORD_FETCH_FAIL) {
        setError(message.error)
      }
    }

    chrome.runtime.onMessage.addListener(onWordDataReceived)

    return () => {
      chrome.runtime.onMessage.removeListener(onWordDataReceived)
    }
  }, [])

  return (
    <Overlay open={open} onClose={() => setOpen(false)} position={position}>
      {!!suggestions && <Suggestions suggestions={suggestions} />}
      {!!error && <ErrorMessage error={error} />}
      {!!wordData && <Content wordData={wordData} />}
    </Overlay>
  )
}

export default Thesaurus

import tailwindCssText from "data-text:~style.css"
import type { PlasmoGetStyle } from "plasmo"
import { useState } from "react"
import { MemoryRouter, Route, Routes } from "react-router-dom"

import { useClickOutside } from "./hooks/useClickOutside"
import { useSelection } from "./hooks/useSelection"
import { useWordData } from "./hooks/useWordData"
import { Overlay } from "./overlay"
import { Error } from "./pages/error"
import { Suggestions } from "./pages/suggestions"
import { Word } from "./pages/word"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = tailwindCssText
  return style
}

function Main() {
  const [open, setOpen] = useState(false)
  const [overlayEl, setOverlayEl] = useState<HTMLElement>(null)
  const { position, selectedText, clearSelectedText } = useSelection({
    element: overlayEl
  })

  const { wordData, wordError, wordSuggestions, clearWordData } = useWordData({
    selectedText,
    onOpen: () => setOpen(true)
  })

  useClickOutside({
    element: overlayEl,
    onClickOutside: () => {
      setOpen(false)
      clearSelectedText()
      clearWordData()
    }
  })

  return (
    <MemoryRouter>
      <Routes>
        <Route
          element={
            <Overlay
              setOverlayEl={setOverlayEl}
              open={open}
              position={position}
            />
          }
        >
          {wordData && (
            <Route path="/" element={<Word wordData={wordData} />} />
          )}
          {wordSuggestions && (
            <Route
              path="/suggestion"
              element={<Suggestions suggestions={wordSuggestions} />}
            />
          )}
          {wordError && (
            <Route path="/error" element={<Error error={wordError} />} />
          )}
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

export default Main

import { useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"

import { useClickOutside } from "~contents/hooks/useClickOutside"
import { useSelection } from "~contents/hooks/useSelection"
import { useWordData } from "~contents/hooks/useWordData"
import { Overlay } from "~contents/overlay"
import { Dictionary } from "~contents/pages/dictionary"
import { Error } from "~contents/pages/error"
import { Suggestions } from "~contents/pages/suggestions"
import { Word } from "~contents/pages/word"

import { ROUTES } from "./routes"

export const ExtensionRouting = () => {
  const [open, setOpen] = useState(false)
  const [overlayEl, setOverlayEl] = useState<HTMLElement>(null)
  const { position, selectedText, clearSelectedText } = useSelection({
    element: overlayEl
  })

  const { wordData, wordError, wordSuggestions, clearWordData } = useWordData({
    selectedText,
    onOpen: () => setOpen(true)
  })

  const navigate = useNavigate()

  useClickOutside({
    element: overlayEl,
    onClickOutside: () => {
      setOpen(false)
      navigate("/")
      clearSelectedText()
      clearWordData()
    }
  })

  return (
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
          <Route path={ROUTES.MAIN} element={<Word wordData={wordData} />} />
        )}
        {wordSuggestions && (
          <Route
            path={ROUTES.SUGGESTIONS}
            element={<Suggestions suggestions={wordSuggestions} />}
          />
        )}
        {wordError && (
          <Route path={ROUTES.ERROR} element={<Error error={wordError} />} />
        )}
        <Route path={ROUTES.DICTIONARY} element={<Dictionary />} />
      </Route>
    </Routes>
  )
}

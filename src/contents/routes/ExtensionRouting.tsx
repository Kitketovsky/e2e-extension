import { useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"

import { useClickOutside } from "~contents/hooks/useClickOutside"
import { useSelection } from "~contents/hooks/useSelection"
import { useWordData } from "~contents/hooks/useWordData"
import { Overlay } from "~contents/overlay"
import { Dictionary } from "~contents/pages/dictionary"
import { Error } from "~contents/pages/error"
import { Suggestions } from "~contents/pages/word/suggestions"
import { Word } from "~contents/pages/word/word"

import { ROUTES } from "./routes"

export const ExtensionRouting = () => {
  const [overlayEl, setOverlayEl] = useState<HTMLElement>(null)
  const { position, selectedText, clearSelectedText, setSelectedText } =
    useSelection({
      element: overlayEl
    })

  const { wordData, wordError, wordSuggestions, clearWordData, isLoading } =
    useWordData({
      selectedText
    })

  const navigate = useNavigate()

  useClickOutside({
    element: overlayEl,
    onClickOutside: () => {
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
            isLoading={isLoading}
            setOverlayEl={setOverlayEl}
            open={!!selectedText}
            position={position}
          />
        }
      >
        <Route
          path={ROUTES.MAIN}
          element={
            <Word wordData={wordData} setSelectedText={setSelectedText} />
          }
        />
        <Route
          path={ROUTES.SUGGESTIONS}
          element={<Suggestions suggestions={wordSuggestions} />}
        />
        <Route path={ROUTES.ERROR} element={<Error error={wordError} />} />
        <Route path={ROUTES.DICTIONARY} element={<Dictionary />} />
      </Route>
    </Routes>
  )
}

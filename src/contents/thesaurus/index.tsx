import tailwindCssText from "data-text:~style.css"
import type { PlasmoGetStyle } from "plasmo"
import React, { useEffect, useState } from "react"

import { MerriamWebster } from "~lib/MerriamWebster"
import type { WordInformation } from "~types/word"

import { Content } from "./components/content"
import { ErrorMessage } from "./components/error-message"
import { Suggestions } from "./components/suggestions"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = tailwindCssText
  return style
}

const wordRegex = /^[a-zA-Z]+$/

const Thesaurus = () => {
  const [open, setOpen] = useState(false)

  const [wordInformation, setWordInformation] =
    useState<WordInformation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[] | null>(null)

  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  )

  const [overlayEl, setOverlayEl] = useState<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(event) {
      if (!overlayEl.contains(event.target)) {
        setOpen(false)
      }
    }

    document.body.addEventListener("mousedown", onClick)

    return () => {
      document.body.removeEventListener("mousedown", onClick)
    }
  }, [overlayEl])

  useEffect(() => {
    function onTextSelect() {
      const selectedText = window.getSelection().toString().trim().toLowerCase()

      const isWord = wordRegex.test(selectedText)

      if (selectedText && isWord) {
        const selection = window.getSelection()
        const range = selection.getRangeAt(0)

        const isSelectedInsideExtension = !open
          ? false
          : overlayEl.contains(range.endContainer.parentElement)

        if (!isSelectedInsideExtension) {
          const rect = range.getBoundingClientRect()

          // TODO: for example, if clicked too right, the popup will not be visible, fix the positioning
          const initialPopupPosition = {
            x: rect.x,
            y: rect.y + rect.height
          }

          setPosition(initialPopupPosition)
          setSelectedText(selectedText)
        }
      }
    }

    document.body.addEventListener("mouseup", onTextSelect)

    return () => {
      document.body.removeEventListener("mouseup", onTextSelect)
    }
  }, [open, overlayEl])

  useEffect(() => {
    if (selectedText || position) {
      MerriamWebster.getWordInformation(selectedText)
        .then((res) => {
          if (res.type === "found") {
            setWordInformation(res.data)
          }
          if (res.type === "suggestions") {
            setSuggestions(res.data)
          }
        })
        .catch((error) => {
          setError(error?.message || "Error fetching word information")
        })
        .finally(() => {
          setOpen(true)
        })
    }
  }, [selectedText, position])

  if (!open) {
    return null
  }

  return (
    <div
      ref={setOverlayEl}
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
      className="fixed bg-white overflow-y-scroll text-black p-4 rounded-xl z-50 flex max-w-[370px] max-h-[500px] min-w-[300px] border border-black"
    >
      {!!suggestions && <Suggestions suggestions={suggestions} />}
      {!!error && <ErrorMessage error={error} />}
      {!!wordInformation && <Content wordInformation={wordInformation} />}
    </div>
  )
}

export default Thesaurus

import { useEffect, useState } from "react"

import { CONFIG } from "~contents/config"

const wordRegex = /^[a-zA-Z]+$/

interface Props {
  element: HTMLElement | null
}

function calculatePopupPosition(rect: DOMRect) {
  let x = rect.x
  let y = rect.y + rect.height

  const isWidthOverlay = x + CONFIG.popup.width > window.innerWidth
  const isHeightOverlay = y + CONFIG.popup.height > window.innerHeight

  if (isWidthOverlay) {
    if (window.innerWidth > CONFIG.popup.width) {
      const margin = (window.innerWidth - CONFIG.popup.width) / 2
      x = margin
    } else {
      x = 0
    }
  }

  if (isHeightOverlay) {
    y = rect.y - CONFIG.popup.height
  }

  return { x, y }
}

export function useSelection({ element }: Props) {
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  )

  function clearSelectedText() {
    setSelectedText(null)
  }

  useEffect(() => {
    function onTextSelect() {
      const selectedText = window.getSelection().toString().trim().toLowerCase()

      const isWord = wordRegex.test(selectedText)

      if (selectedText && isWord) {
        const selection = window.getSelection()
        const range = selection.getRangeAt(0)

        const isSelectedInsideExtension =
          !open || !element
            ? false
            : element.contains(range.endContainer.parentElement)

        if (!isSelectedInsideExtension) {
          const selectedWordRect = range.getBoundingClientRect()
          const position = calculatePopupPosition(selectedWordRect)

          setPosition(position)
          setSelectedText(selectedText)
        }
      }
    }

    document.body.addEventListener("mouseup", onTextSelect)

    return () => {
      document.body.removeEventListener("mouseup", onTextSelect)
    }
  }, [open, element])

  return { selectedText, position, clearSelectedText, setSelectedText }
}

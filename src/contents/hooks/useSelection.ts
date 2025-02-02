import { useEffect, useState } from "react"

const wordRegex = /^[a-zA-Z]+$/

interface Props {
  element: HTMLElement | null
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
  }, [open, element])

  return { selectedText, position, clearSelectedText, setSelectedText }
}

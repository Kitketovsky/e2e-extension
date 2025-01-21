import { useEffect, useState } from "react"

import { MerriamWebster } from "~lib/MerriamWebster"
import type { WordInformation } from "~types/word"

interface Props {
  selectedText: string | null
  onOpen: () => void
}

export function useWordData({ selectedText, onOpen }: Props) {
  const [wordData, setWordData] = useState<WordInformation>(null)
  const [wordSuggestions, setWordSuggestions] = useState<string[]>(null)
  const [wordError, setWordError] = useState<string>(null)

  function clearWordData() {
    setWordData(null)
    setWordSuggestions(null)
    setWordError(null)
  }

  useEffect(() => {
    if (selectedText) {
      chrome.storage.local.get(selectedText).then((res) => {
        if (selectedText in res) {
          const wordInformation = res[selectedText] as WordInformation
          setWordData(wordInformation)
          onOpen()
        } else {
          MerriamWebster.getWordInformation(selectedText)
            .then((res) => {
              if (res.type === "found") {
                setWordData(res.data)
              }
              if (res.type === "suggestions") {
                setWordSuggestions(res.data)
              }
            })
            .catch((error) => {
              setWordError(error?.message || "Error fetching word information")
            })
            .finally(() => {
              onOpen()
            })
        }
      })
    }
  }, [selectedText])

  return { wordData, wordSuggestions, wordError, clearWordData }
}

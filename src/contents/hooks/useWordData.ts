import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { ROUTES } from "~contents/routes/routes"
import { MerriamWebster } from "~lib/mw/index"
import type { WordInformation } from "~types/word"

interface Props {
  selectedText: string | null
}

export function useWordData({ selectedText }: Props) {
  const [wordData, setWordData] = useState<WordInformation | null>(null)
  const [wordSuggestions, setWordSuggestions] = useState<string[] | null>(null)
  const [wordError, setWordError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  function clearWordData() {
    setWordData(null)
    setWordSuggestions(null)
    setWordError(null)
  }

  const navigate = useNavigate()

  useEffect(() => {
    if (selectedText) {
      chrome.storage.local.get(selectedText).then((res) => {
        if (selectedText in res) {
          const wordInformation = res[selectedText] as WordInformation
          setWordData(wordInformation)
        } else {
          setIsLoading(true)
          MerriamWebster.getWordInformation(selectedText)
            .then((res) => {
              console.log("useWordData::response", res)
              if (res.type === "found") {
                setWordData(res.data)
              }
              if (res.type === "suggestions") {
                setWordSuggestions(res.data)
                navigate(ROUTES.SUGGESTIONS)
              }
            })
            .catch((error) => {
              console.log("useWordData::error", error)
              setWordError(error?.message || "Error fetching word information")
              navigate(ROUTES.ERROR)
            })
            .finally(() => {
              setIsLoading(false)
            })
        }
      })
    }
  }, [selectedText])

  return { wordData, wordSuggestions, wordError, clearWordData, isLoading }
}

import { useEffect, useState } from "react"

import type { WordInformation } from "~types/word"

interface Props {
  wordData: WordInformation
}

export function useStorage({ wordData }: Props) {
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (wordData.word) {
      chrome.storage.local.get(wordData.word).then((res) => {
        if (wordData.word in res) {
          setIsSaved(true)
        }
      })
    }
  }, [wordData])

  function toggleSave() {
    if (isSaved) {
      chrome.storage.local.remove(wordData.word).then(() => setIsSaved(false))
    } else {
      chrome.storage.local
        .set({
          [wordData.word]: wordData
        })
        .then(() => setIsSaved(true))
    }
  }

  return { isSaved, toggleSave }
}

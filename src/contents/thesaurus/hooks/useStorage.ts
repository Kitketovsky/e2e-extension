import { useEffect, useState } from "react"

import type { WordInformation } from "~types/word"

interface Props {
  wordInformation: WordInformation
}

export function useStorage({ wordInformation }: Props) {
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (wordInformation.word) {
      chrome.storage.local.get(wordInformation.word).then((res) => {
        if (wordInformation.word in res) {
          setIsSaved(true)
        }
      })
    }
  }, [wordInformation])

  function toggleSave() {
    if (isSaved) {
      chrome.storage.local
        .remove(wordInformation.word)
        .then(() => setIsSaved(false))
    } else {
      chrome.storage.local
        .set({
          [wordInformation.word]: wordInformation
        })
        .then(() => setIsSaved(true))
    }
  }

  return { isSaved, toggleSave }
}

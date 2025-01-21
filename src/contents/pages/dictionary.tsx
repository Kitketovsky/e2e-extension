import { useEffect, useState } from "react"

import type { WordInformation } from "~types/word"

export const Dictionary = () => {
  const [dictionaryWords, setDictionaryWords] = useState<WordInformation[]>([])

  async function getDictionaryWords() {
    const res = await chrome.storage.local.get()
    const storedWords = res as Record<string, WordInformation>
    setDictionaryWords(Object.values(storedWords))
  }

  async function removeDictionaryWord(word: string) {
    await chrome.storage.local.remove(word)
    await getDictionaryWords()
  }

  useEffect(() => {
    getDictionaryWords()
  }, [])

  return (
    <div className="flex flex-col gap-2 w-full">
      {dictionaryWords.length === 0 && <span>Your dictionary is empty...</span>}

      {dictionaryWords.length > 0 &&
        dictionaryWords.map((data) => (
          <div className="flex w-full items-center justify-between">
            <span>{data.word}</span>

            <div>
              <button onClick={() => removeDictionaryWord(data.word)}>
                Remove
              </button>
            </div>
          </div>
        ))}
    </div>
  )
}

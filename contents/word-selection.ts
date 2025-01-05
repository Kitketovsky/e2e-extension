import { MSG_TYPES } from "./msg-types"

const wordRegex = /^[a-zA-Z]+$/

window.addEventListener("mouseup", () => {
  const selectedText = window.getSelection().toString().trim()

  if (!selectedText) {
    return false
  }

  const isWord = wordRegex.test(selectedText)

  if (!isWord) {
    return false
  }

  chrome.runtime.sendMessage({
    type: MSG_TYPES.WORD_BACKGROUND,
    word: selectedText
  })
})

export {}

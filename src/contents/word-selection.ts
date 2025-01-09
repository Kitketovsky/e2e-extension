import { MSG_TYPES } from "../const/msg-types"

const wordRegex = /^[a-zA-Z]+$/

window.addEventListener("mouseup", () => {
  const selectedText = window.getSelection().toString().trim().toLowerCase()

  if (!selectedText) {
    return false
  }

  const isWord = wordRegex.test(selectedText)

  if (!isWord) {
    return false
  }

  const position = getWordPopupPosition()

  chrome.runtime.sendMessage({
    type: MSG_TYPES.WORD_BACKGROUND,
    data: selectedText,
    position
  })
})

function getWordPopupPosition() {
  const selection = window.getSelection()
  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()

  return {
    x: rect.x,
    y: rect.y + rect.height
  }
}

export {}

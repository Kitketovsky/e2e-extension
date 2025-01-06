import { MSG_TYPES } from "~contents/msg-types"

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === MSG_TYPES.WORD_BACKGROUND) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id) {
        // TODO: fetch all the necessary data
        // TODO: parse all the MW tokens into HTML if necessary
        // TODO: send formatted data to the component

        chrome.tabs.sendMessage(tabs[0].id, {
          type: MSG_TYPES.WORD_THESAURUS,
          word: message.word
        })
      }
    })
  }
})

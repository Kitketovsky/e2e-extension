import { MSG_TYPES } from "~contents/msg-types"
import { MerriamWebster } from "~lib/MerriamWebster"

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === MSG_TYPES.WORD_BACKGROUND) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id) {
        MerriamWebster.getWordInformation(message.word)
          .then((data) => {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: MSG_TYPES.WORD_FETCH_SUCCESS,
              data
            })
          })
          .catch((error) => {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: MSG_TYPES.WORD_FETCH_FAIL,
              error: error?.message || "Error fetching word information"
            })
          })
      }
    })
  }
})

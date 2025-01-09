import { MSG_TYPES } from "~const/msg-types"
import { MerriamWebster } from "~lib/MerriamWebster"

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === MSG_TYPES.WORD_BACKGROUND) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id) {
        MerriamWebster.getWordInformation(message.data)
          .then((res) => {
            if (res.type === "suggestions") {
              chrome.tabs.sendMessage(tabs[0].id, {
                type: MSG_TYPES.WORD_SUGGESTIONS,
                data: res.data,
                position: message.position
              })
            }

            if (res.type === "found") {
              chrome.tabs.sendMessage(tabs[0].id, {
                type: MSG_TYPES.WORD_FETCH_SUCCESS,
                data: res.data,
                position: message.position
              })
            }
          })
          .catch((error) => {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: MSG_TYPES.WORD_FETCH_FAIL,
              error: error?.message || "Error fetching word information",
              position: message.position
            })
          })
      }
    })
  }
})

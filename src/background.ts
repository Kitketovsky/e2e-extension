import OFFSCREEN_DOCUMENT_PATH from "url:~/src/offscreen.html"

chrome.runtime.onInstalled.addListener(() => {
  // TODO: redirect to introduction page
  // TODO: 'onInstalled' analytics event
})

chrome.runtime.onMessage.addListener(onPlayTranscriptionAudio)

async function onPlayTranscriptionAudio(message: any) {
  if (
    message.type === "transcription_play" &&
    message.target === "background"
  ) {
    const hasDocument = await chrome.offscreen.hasDocument()

    if (!hasDocument) {
      await chrome.offscreen.createDocument({
        url: OFFSCREEN_DOCUMENT_PATH,
        reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
        justification:
          "The page is used to play transcription audio of the word"
      })
    }

    chrome.runtime.sendMessage({
      type: message.type,
      target: "offscreen",
      url: message.url
    })
  }

  if (
    message.type === "transcription_played" &&
    message.target === "background"
  ) {
    const tabs = await chrome.tabs.query({ currentWindow: true, active: true })

    if (!tabs.length) {
      return
    }

    const [currentTab] = tabs

    chrome.tabs.sendMessage(currentTab.id, {
      type: "transcription_played",
      target: "content"
    })
  }
}

export {}

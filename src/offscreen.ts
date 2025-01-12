const transcription = new Audio()

transcription.addEventListener("ended", () => {
  chrome.runtime.sendMessage({
    type: "transcription_played",
    target: "background"
  })
})

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "transcription_play" && message.target === "offscreen") {
    transcription.src = message.url
    transcription.play()
  }
})

export {}

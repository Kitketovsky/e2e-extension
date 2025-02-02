import { Volume2 } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "~components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "~components/ui/tooltip"

interface Props {
  audioUrl: string | null
  wrapperEl: HTMLElement | null
}

export function PlayAudioButton({ audioUrl, wrapperEl }: Props) {
  const [isTranscriptionPlaying, setIsTranscriptionPlaying] = useState(false)

  function playPronunciation() {
    chrome.runtime.sendMessage({
      type: "transcription_play",
      target: "background",
      url: audioUrl
    })

    setIsTranscriptionPlaying(true)
  }

  useEffect(() => {
    function onAudioPlayed(message: any) {
      if (
        message.type === "transcription_played" &&
        message.target === "content"
      ) {
        setIsTranscriptionPlaying(false)
      }
    }

    chrome.runtime.onMessage.addListener(onAudioPlayed)

    return () => {
      chrome.runtime.onMessage.removeListener(onAudioPlayed)
    }
  }, [])

  if (!audioUrl) {
    return <></>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={playPronunciation}
          disabled={isTranscriptionPlaying}
        >
          <Volume2 />
        </Button>
      </TooltipTrigger>
      <TooltipContent container={wrapperEl} className="z-[9999]">
        <span>Play pronunciation</span>
      </TooltipContent>
    </Tooltip>
  )
}

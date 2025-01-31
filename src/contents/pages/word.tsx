import { Bookmark, Volume2 } from "lucide-react"
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"

import { badgeVariants } from "~components/ui/badge"
import { Button } from "~components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "~components/ui/tooltip"
import type { WordInformation } from "~types/word"

import { useStorage } from "../hooks/useStorage"

interface Props {
  wordData: WordInformation
}

export const Word = ({ wordData }: Props) => {
  const {
    word: spelling,
    definitions,
    pronunciation,
    ants,
    syns
    // et
  } = wordData
  const { audioUrl, transcription } = pronunciation

  const { isSaved, toggleSave } = useStorage({ wordData })

  const [wrapperEl, setWrapperEl] = useState<HTMLElement | null>(null)

  const [isTranscriptionPlaying, setIsTranscriptionPlaying] = useState(false)

  function playPronunciation() {
    if (!audioUrl) {
      return
    }

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

  return (
    <TooltipProvider>
      <div ref={setWrapperEl} className="flex flex-col gap-4 text-sm h-full">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-bold text-2xl">{spelling}</span>
            {transcription && (
              <span className="text-gray-400">{transcription}</span>
            )}
          </div>

          <div className="flex gap-2 items-center">
            {audioUrl && (
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
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={toggleSave}>
                  <Bookmark fill={isSaved ? "black" : "transparent"} />
                </Button>
              </TooltipTrigger>
              <TooltipContent container={wrapperEl} className="z-[9999]">
                <span>Save to dictionary</span>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col divide-y">
          {definitions.map(({ word, part, sences }) => {
            return (
              <div className="flex flex-col first:pt-0 last:pb-0 py-4 gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base">{word}</span>
                  <span>{part}</span>
                </div>

                <div className="flex flex-col gap-2">
                  {sences.map(({ def, examples }) => {
                    return (
                      <div className="flex flex-col gap-2">
                        <span>
                          -{" "}
                          <span
                            dangerouslySetInnerHTML={{ __html: def }}
                          ></span>
                        </span>

                        {examples.length > 0 && (
                          <ul className="flex flex-col gap-2 text-xs text-gray-400">
                            {examples.map((example) => (
                              <li
                                className="[i]:text-red-400"
                                dangerouslySetInnerHTML={{ __html: example }}
                              ></li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Synonims */}
        {syns.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="font-bold">Synonyms:</span>

            <div className="flex flex-wrap gap-1 text-xs">
              {syns.map((syn) => (
                <NavLink
                  to={`/word/${syn}`}
                  className={badgeVariants({ variant: "secondary" })}
                >
                  {syn}
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Antonyms */}
        {ants.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="font-bold">Antonyms:</span>

            <div className="flex flex-wrap gap-1 text-xs">
              {ants.map((ant) => (
                <NavLink
                  to={`/word/${ant}`}
                  className={badgeVariants({ variant: "secondary" })}
                >
                  {ant}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

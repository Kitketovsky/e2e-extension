import { Bookmark, Volume2 } from "lucide-react"
import { useEffect, useState } from "react"

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
    <div className="flex flex-col gap-4 text-sm h-full">
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
            <button
              onClick={playPronunciation}
              disabled={isTranscriptionPlaying}
              className="border border-black rounded-md p-2 disabled:bg-gray-100"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          )}

          <button
            className="border border-black rounded-md p-2 disabled:bg-gray-100"
            onClick={toggleSave}
          >
            <Bookmark
              className="h-4 w-4"
              fill={isSaved ? "black" : "transparent"}
            />
          </button>
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
                    <div className="flex flex-col gap-2 pl-2">
                      <span>- {def}</span>

                      {examples.length > 0 && (
                        <ul className="flex flex-col gap-2 text-xs italic text-gray-400">
                          {examples.map((example) => (
                            <li>"{example}"</li>
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
      {syns && (
        <div className="flex flex-col gap-2">
          <span>Synonyms:</span>

          <div className="flex flex-wrap gap-1 text-xs">
            {syns.map((syn) => (
              <span className="border border-black px-1 rounded-md">{syn}</span>
            ))}
          </div>
        </div>
      )}

      {/* Antonyms */}
      {ants && (
        <div className="flex flex-col gap-2">
          <span>Antonyms:</span>

          <div className="flex flex-wrap gap-1 text-xs">
            {ants.map((ant) => (
              <span className="border border-black px-1 rounded-md">{ant}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

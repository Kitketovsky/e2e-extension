import { Bookmark, Volume2 } from "lucide-react"
import { useEffect, useState } from "react"

import type { WordInformation } from "~types/word"

import { useStorage } from "../hooks/useStorage"

interface Props {
  wordInformation: WordInformation
}

export const Content = ({ wordInformation: word }: Props) => {
  const { word: spelling, words, pronunciation, et } = word
  const { audioUrl, transcription } = pronunciation

  const { isSaved, toggleSave } = useStorage({ wordInformation: word })

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

      {/* FIXME: parse 'et' content, it has {it}, {ma} and other tokens */}
      {/* {et && (
        <div className="flex flex-col text-gray-600">
          <span>Etimology:</span>
          <span>{et}</span>
        </div>
      )} */}

      {/* Body */}
      <div className="flex flex-col divide-y">
        {words.map(({ word, part, definitions }) => {
          return (
            <div className="flex flex-col first:pt-0 last:pb-0 py-4 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base">{word}</span>
                <span>{part}</span>
              </div>

              <div className="flex flex-col gap-8">
                {definitions.map((def) => {
                  return (
                    <div className="flex flex-col gap-2 pl-2">
                      <span>- {def.def}</span>

                      {def.examples && (
                        <div className="flex flex-col gap-2">
                          <span className="font-bold">Examples</span>

                          <ul>
                            {def.examples.map((example) => (
                              <li>"{example}"</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {def.syns && (
                        <div className="flex flex-col gap-2">
                          <span className="font-bold">Synonims</span>

                          <ul className="flex flex-wrap gap-x-1 gap-y-2">
                            {def.syns.map((syn) => (
                              <li className="text-xs font-bold border border-black rounded-xl px-2">
                                {syn}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {def.ants && (
                        <div className="flex flex-col gap-2">
                          <span className="font-bold">Antonyms</span>

                          <ul className="flex flex-wrap gap-x-1 gap-y-2">
                            {def.ants.map((syn) => (
                              <li className="text-xs font-bold border border-black rounded-xl px-2">
                                {syn}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

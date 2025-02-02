import { useState } from "react"

import { badgeVariants } from "~components/ui/badge"
import { TooltipProvider } from "~components/ui/tooltip"
import type { WordInformation } from "~types/word"

import { PlayAudioButton } from "./components/play-audio-btn"
import { SaveDictionaryButton } from "./components/save-dictionary-btn"

interface Props {
  wordData: WordInformation
  setSelectedText: React.Dispatch<React.SetStateAction<string>>
}

export const Word = ({ wordData, setSelectedText }: Props) => {
  const [wrapperEl, setWrapperEl] = useState<HTMLElement | null>(null)

  if (!wordData) {
    return null
  }

  const {
    word: spelling,
    definitions,
    pronunciation,
    ants,
    syns
    // et
  } = wordData

  const { audioUrl, transcription } = pronunciation

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
            <PlayAudioButton audioUrl={audioUrl} wrapperEl={wrapperEl} />
            <SaveDictionaryButton wordData={wordData} wrapperEl={wrapperEl} />
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
                <button
                  onClick={() => setSelectedText(syn)}
                  className={badgeVariants({ variant: "secondary" })}
                >
                  {syn}
                </button>
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
                <button
                  onClick={() => setSelectedText(ant)}
                  className={badgeVariants({ variant: "secondary" })}
                >
                  {ant}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

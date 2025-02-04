import { useState } from "react"

import { TooltipProvider } from "~components/ui/tooltip"
import type { WordInformation } from "~types/word"

import { BadgesList } from "./components/badges-list"
import { Definitions } from "./components/definitions"
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

  const { word: spelling, definitions, pronunciation, ants, syns } = wordData

  const { audioUrl, transcription } = pronunciation

  function onBadgeClick(word: string) {
    setSelectedText(word)
  }

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

        <Definitions definitions={definitions} />

        <BadgesList title="Synonims" list={syns} onClick={onBadgeClick} />

        <BadgesList title="Antonyms" list={ants} onClick={onBadgeClick} />
      </div>
    </TooltipProvider>
  )
}

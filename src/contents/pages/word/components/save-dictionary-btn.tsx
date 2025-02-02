import { Bookmark } from "lucide-react"

import { Button } from "~components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "~components/ui/tooltip"
import { useStorage } from "~contents/hooks/useStorage"
import type { WordInformation } from "~types/word"

interface Props {
  wrapperEl: HTMLElement | null
  wordData: WordInformation
}

export function SaveDictionaryButton({ wrapperEl, wordData }: Props) {
  const { isSaved, toggleSave } = useStorage({ wordData })

  return (
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
  )
}

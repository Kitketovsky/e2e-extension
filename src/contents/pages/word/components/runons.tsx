import type { WordInformation } from "~types/word"

interface Props {
  runons: WordInformation["runons"]
}

export function Runons({ runons }: Props) {
  if (!runons) {
    return null
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="font-bold text-base">Runons:</span>

      <div className="flex flex-wrap gap-2">
        {runons.map(({ part, pronunciation, word }) => (
          <span className="text-sm text-gray-400">
            {word} ({part})
          </span>
        ))}
      </div>
    </div>
  )
}

import type { WordInformation } from "~types/word"

interface Props {
  definitions: WordInformation["definitions"]
}

export function Definitions({ definitions }: Props) {
  return (
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
                      - <span dangerouslySetInnerHTML={{ __html: def }}></span>
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
  )
}

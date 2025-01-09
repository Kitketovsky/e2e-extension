import type { WordInformation } from "~types/word"

interface Props {
  wordInformation: WordInformation
}

export const Content = ({ wordInformation: word }: Props) => {
  // In the header
  // word (part) (pronunciation)

  // Body
  // word.words

  // word (part)
  // definitions
  // def
  // examples
  // syns
  // ants

  console.log("word", word)

  const { word: spelling, words, pronunciation, et, part } = word
  const { audioUrl, transcription } = pronunciation

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center">
        <span>{spelling}</span>
        <span>{part}</span>
        {transcription && <span>{transcription}</span>}
        {audioUrl && <audio src={audioUrl}></audio>}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-6">
        {words.map(({ word, part, definitions }) => {
          return (
            <div className="flex flex-col gap-8">
              <div>
                <span>{word}</span>
                <span>{part}</span>
              </div>

              {definitions.map((def) => {
                return (
                  <div>
                    <span>{def.def}</span>

                    {def.examples && (
                      <div className="flex flex-col gap-2">
                        {def.examples.map((example) => (
                          <span>{example}</span>
                        ))}
                      </div>
                    )}

                    {def.syns && (
                      <div className="flex flex-col">
                        {def.syns.map((syn) => (
                          <span>{syn}</span>
                        ))}
                      </div>
                    )}

                    {def.ants && (
                      <div className="flex flex-col">
                        {def.ants.map((ant) => (
                          <span>{ant}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div>
        <span>footer</span>
      </div>
    </div>
  )
}

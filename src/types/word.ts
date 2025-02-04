import type { Pronunciation } from "./mw/dictionary"

export interface WordInformation {
  word: string
  pronunciation: {
    transcription: string | null
    audioUrl: string | null
  }
  et: string | null
  definitions: {
    word: string
    part: string
    sences: {
      def: string
      examples: string[]
    }[]
  }[]
  runons:
    | {
        word: string
        part: string
        pronunciation?: {
          transcription: string
          audioUrl: string
        }
      }[]
    | null
  syns: string[] | null
  ants: string[] | null
}

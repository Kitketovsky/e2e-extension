export interface WordInformation {
  word: string
  part: string
  pronunciation: {
    transcription: string | null
    audioUrl: string | null
  }
  et: string | null
  words: {
    word: string
    part: string
    definitions: {
      def: string
      examples: string[]
      syns: string[]
      ants: string[]
    }[]
  }[]
}

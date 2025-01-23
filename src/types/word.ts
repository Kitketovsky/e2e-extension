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
  syns: string[] | null
  ants: string[] | null
}

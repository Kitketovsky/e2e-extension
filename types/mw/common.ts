export type MWHeadwordInformation = {
  hw: string
  prs?: MWPronunciation[]
}

type MWPronunciation = {
  mw: string
  sound?: {
    audio: string
    ref: string
    stat: string
  }
}

export type MWPronunciationSound = {
  audio: string
  ref: string
  stat: string
}

export type MWFunctionalLabel = string

export type MWShortDefinitions = string[]

export type MWDefinitions = MWSenseSequence[]

type MWSenseSequence = MWSense[]
type MWSense = [
  "sense",
  {
    sn: string
    dt: MWDefiningText
  }
]
type MWDefiningText = [["text", string], MWVerbalIllustration]
type MWVerbalIllustration = ["vis", { t: string }]

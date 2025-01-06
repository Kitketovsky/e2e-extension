export type MWDictionaryResponse = {
  meta: MWDictionaryWordMeta
  hwi: MWHeadwordInformation
  fl: MWDictionaryFunctionalLabel
  hom?: number
  et: MWDictionaryEtymology
  shortdef: MWDictionaryShortDefinitions
  def: MWDictionaryDefinitions
  date: MWDictionaryFirstKnownUse
}[]

type MWDictionaryWordMeta = {
  id: string
  uuid: string
  sort: string
  src: string
  section: string
  stems: string[]
  offensive: boolean
}

type MWDictionaryPronunciation = {
  mw: string
  sound: {
    audio: string
    ref: string
    stat: string
  }
}

type MWHeadwordInformation = {
  hw: string
  prs: MWDictionaryPronunciation[]
}

type MWDictionaryFunctionalLabel = string

type MWDictionaryEtymology = (
  | MWDictionaryEtymologyContent
  | MWDictionaryEtymologySupplementalNote
)[]
type MWDictionaryEtymologyContent = ["text", string]
type MWDictionaryEtymologySupplementalNote = ["et-snote", ["t", string]]

type MWDictionaryShortDefinitions = string[]

type MWDictionaryDefinitions = MWDictionarySenseSequence[]
type MWDictionarySenseSequence = MWDictionarySense[]
type MWDictionarySense = [
  "sense",
  {
    sn: string
    dt: MWDictionaryDefiningText
  }
]
type MWDictionaryDefiningText = [
  ["text", string],
  MWDictionaryVerbalIllustration
]
type MWDictionaryVerbalIllustration = ["vis", { t: string }]

type MWDictionaryFirstKnownUse = string

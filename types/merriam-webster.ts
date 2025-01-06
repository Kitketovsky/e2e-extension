export type MWThesaurusResponse = {
  meta: MWWordMeta
  hwi: MWHeadwordInformation
  fl: MWFunctionalLabel
  hom?: number
  et: MWEtymology
  shortdef: MWShortDefinitions
  def: MWDefinitions
  date: MWFirstKnownUse
}[]

type MWWordMeta = {
  id: string
  uuid: string
  sort: string
  src: string
  section: string
  stems: string[]
  offensive: boolean
}

type MWPronunciation = {
  mw: string
  sound: {
    audio: string
    ref: string
    stat: string
  }
}

type MWHeadwordInformation = {
  hw: string
  prs: MWPronunciation[]
}

type MWFunctionalLabel = string

type MWEtymology = (MWEtymologyContent | MWEtymologySupplementalNote)[]
type MWEtymologyContent = ["text", string]
type MWEtymologySupplementalNote = ["et-snote", ["t", string]]

type MWShortDefinitions = string[]

type MWDefinitions = MWSenseSequence[]
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

type MWFirstKnownUse = string

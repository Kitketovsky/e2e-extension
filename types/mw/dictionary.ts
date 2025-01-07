import type {
  MWFunctionalLabel,
  MWHeadwordInformation,
  MWShortDefinitions
} from "./common"

export type MWDictionaryResponse = {
  meta: MWDictionaryWordMeta
  hwi: MWHeadwordInformation
  fl: MWFunctionalLabel
  et?: MWDictionaryEtymology
  shortdef: MWShortDefinitions
  def: MWDictionaryDefinitions
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

type MWDictionaryEtymology = (
  | MWDictionaryEtymologyContent
  | MWDictionaryEtymologySupplementalNote
)[]
type MWDictionaryEtymologyContent = ["text", string]
type MWDictionaryEtymologySupplementalNote = ["et-snote", ["t", string]]

type MWDictionaryDefinitions = [
  "sense",
  {
    sn: string
    dt: [["text", string], ["vis", { t: string }[]]]
  }
][][]

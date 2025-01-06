import type {
  MWDefinitions,
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
  def: MWDefinitions
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

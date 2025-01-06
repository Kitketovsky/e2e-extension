import type {
  MWDefinitions,
  MWFunctionalLabel,
  MWShortDefinitions
} from "./common"

export type MWThesaurusResponse = {
  meta: MWThesaurusMeta
  def: MWDefinitions
  fl: MWFunctionalLabel
  shortdef: MWShortDefinitions
}[]

type MWThesaurusMeta = {
  id: string
  uuid: string
  src: string
  section: string
  target: {
    tuuid: string
    tsrc: string
  }
  stems: string[]
  syns: string[][]
  ants: string[][]
  offensive: boolean
}

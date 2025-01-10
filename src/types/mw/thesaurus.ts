import type {
  MWFunctionalLabel,
  MWHeadwordInformation,
  MWShortDefinitions
} from "./common"

export type MWThesaurusResponse = {
  meta: MWThesaurusMeta
  def: MWThesaurusDefinitions
  fl: MWFunctionalLabel
  shortdef: MWShortDefinitions
  hwi: MWHeadwordInformation
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

type MWThesaurusDefinitions = {
  sseq: [
    "sense",
    {
      sn: string
      // tags in dt: bnw, ca, ri, snote, uns, or vis
      dt: [["text", string], ["vis", { t: string }[]]]
      syn_list?: MWThesaurusList
      rel_list?: MWThesaurusList
      near_list?: MWThesaurusList
      ant_list?: MWThesaurusList
      opp_list?: MWThesaurusList
    }
  ][][]
}[]

type MWThesaurusList = { wd: string }[][]

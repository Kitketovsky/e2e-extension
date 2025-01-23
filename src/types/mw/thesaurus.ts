export type MWThesaurusResponse = {
  meta: {
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
  def: {
    sseq: [
      "sense",
      {
        sn: string
        // tags in dt: bnw, ca, ri, snote, uns, or vis
        dt: [["text", string], ["vis", { t: string }[]]]
        syn_list?: { wd: string }[][]
        sim_list?: { wd: string }[][]
        rel_list?: { wd: string }[][]
        near_list?: { wd: string }[][]
        ant_list?: { wd: string }[][]
        opp_list?: { wd: string }[][]
      }
    ][][]
  }[]
  fl: string
  shortdef: string[]
  hwi: {
    hw: string
    prs?: {
      mw: string
      sound?: {
        audio: string
        ref: string
        stat: string
      }
    }[]
  }
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

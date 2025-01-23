export type MWDictionaryResponse = {
  meta: {
    id: string
    uuid: string
    sort: string
    src: string
    section: string
    stems: string[]
    offensive?: boolean
  }
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
  fl: string
  et?: ["text", string] | ["et-snote", ["t", string]]
  shortdef: string[]
  def: {
    sseq: [
      "sense",
      {
        // the subject area or regional/usage status, e.g.: 'chiefly British', 'sometimes offensive'
        sls?: string[]
        sn: string
        // "text" is required, "vis" is optional
        dt: Array<["text", string] | ["vis", { t: string }[]]>
      }
    ][][]
  }[]
}[]

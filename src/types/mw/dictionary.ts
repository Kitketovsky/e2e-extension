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
    prs?: Pronunciation
  }
  fl: string
  et?: ["text", string] | ["et-snote", ["t", string]]
  shortdef: string[]
  def: {
    sseq: Sseq
  }[]
  uros?: Uros
  ins?: Inflections
}[]

type Uros = {
  ure: string
  prs?: Pronunciation
  fl: string
}[]

type Inflections = {
  if: string
  ifc?: string
  il?: string
}[]

export type Pronunciation = {
  mw: string
  sound?: {
    audio: string
    ref: string
    stat: string
  }
}[]

// sseq may include => sense, bs or pseq
// pseq inside sseq => may include bs or sense
type Sseq = (Pseq | Bs | Sense)[][]
type Pseq = ["pseq", (Sense | Bs)[]]

export type Bs = ["bs", { sense: Sense[1] }]

export type Sense = [
  "sense",
  {
    // the subject area or regional/usage status, e.g.: 'chiefly British', 'sometimes offensive'
    sls?: string[]
    sn: string
    // "text" is required, "vis" is optional
    dt: Array<["text", string] | ["vis", { t: string }[]]>
    sdsense?: {
      sd: string
      dt: Array<["text", string] | ["vis", { t: string }[]]>
    }
  }
]

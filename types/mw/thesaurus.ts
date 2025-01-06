export type MWThesaurusResponse = {
  meta: MWThesaurusMeta
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

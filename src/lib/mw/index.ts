import type {
  Bs,
  MWDictionaryResponse,
  Pronunciation,
  Sense
} from "~types/mw/dictionary"
import type { MWThesaurusResponse } from "~types/mw/thesaurus"
import type { WordInformation } from "~types/word"

import { tokens } from "./tokens"

type ApiType = "collegiate" | "thesaurus"

const SINGLE_TAG_REGEX = /{([\w\s\d|:]+)}/g
const DOUBLE_TAGS_REGEX = /{(\w+)}(.+){\/(\1)}/g

export class MerriamWebster {
  constructor() {}

  static #createAudioLink(pronunciation: Pronunciation[number] | null) {
    if (!pronunciation) {
      return null
    }

    // Supported formats: mp3, wav, ogg
    const audioFormat = "mp3"

    const subdirectory = this.#getAudioSubdirectory(pronunciation.sound)

    return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${pronunciation.sound.audio}.${audioFormat}`
  }

  static #getAudioSubdirectory(
    sound: MWDictionaryResponse[number]["hwi"]["prs"][number]["sound"]
  ) {
    if (sound.audio.startsWith("bix")) {
      return "bix"
    }

    if (sound.audio.startsWith("gg")) {
      return "gg"
    }

    if (sound.audio[0].match(/^[^a-zA-Z]+$/)) {
      return "number"
    }

    return sound.audio[0]
  }

  static async #getSelectedLexiconWordInformation(
    word: string,
    api: "collegiate"
  ): Promise<MWDictionaryResponse | string[]>
  static async #getSelectedLexiconWordInformation(
    word: string,
    api: "thesaurus"
  ): Promise<MWThesaurusResponse | string[]>
  static async #getSelectedLexiconWordInformation(word: string, api: ApiType) {
    const API_KEY =
      api === "collegiate"
        ? process.env.PLASMO_PUBLIC_MW_DICTIONARY
        : process.env.PLASMO_PUBLIC_MW_THESAURUS

    const response = await fetch(
      `https://www.dictionaryapi.com/api/v3/references/${api}/json/${word}?key=${API_KEY}`
    )

    const data = await response.json()

    return data
  }

  static #parseTokens(input: string): string {
    const hasDoubleTags = input.match(DOUBLE_TAGS_REGEX)

    if (!hasDoubleTags) {
      const hasSingleTags = input.match(SINGLE_TAG_REGEX)

      if (!hasSingleTags) {
        return input
      }

      const singleTagsCleared = input.replace(
        SINGLE_TAG_REGEX,
        (_, tag, pipedTag) => {
          // The tokens contain fields separated by a pipe character ("|"). There are at least
          // 2 fields and a maximum of 4 fields within these tokens, indicated in the "Token Format" column.

          const [tagName, ...fields] = (tag ?? pipedTag).split("|")

          if (!(tagName in tokens)) {
            throw new Error(
              `Single tag parsing error. No such token as '${tagName}' defined.`
            )
          }

          const formatter = tokens[tagName]

          const formatted = formatter({ content: "", tag: tagName, fields })

          return formatted
        }
      )

      return this.#parseTokens(singleTagsCleared)
    }

    const doubleTagsCleaned = input.replace(
      DOUBLE_TAGS_REGEX,
      (_, openTag, content) => {
        if (!(openTag in tokens)) {
          throw new Error(
            `Double tag parsing error. No such token as '${openTag}' defined.`
          )
        }

        const formatter = tokens[openTag]

        const formatted = formatter({ content, tag: openTag, fields: [] })

        return formatted
      }
    )

    return this.#parseTokens(doubleTagsCleaned)
  }

  static #extractDefinitionsWithExamples(sense: Sense | Bs) {
    const [type, data] = sense

    const extracted = type === "sense" ? data : data.sense

    const definition = extracted.dt.find((dt) => dt[0] === "text")
    const visualIllustration = extracted.dt.find((dt) => dt[0] === "vis")

    const sdsenseDefinition = extracted?.sdsense?.dt.find(
      (dt) => dt[0] === "text"
    )[1]

    const sdsenseText = sdsenseDefinition
      ? `, ${extracted?.sdsense.sd}, ${sdsenseDefinition}`
      : ""

    if (!definition) {
      return {
        def: "",
        examples: []
      }
    }

    return {
      def: this.#parseTokens(`${definition[1]}${sdsenseText}`),
      examples: visualIllustration
        ? visualIllustration[1].map((vis) => this.#parseTokens(vis.t))
        : []
    }
  }

  static #transformDictionary(dictionary: MWDictionaryResponse) {
    const [{ hwi, et, fl, uros, ins }] = dictionary

    const normalizedWord = hwi.hw.replaceAll("*", "")

    const filtered = dictionary.filter((data) => {
      return (
        data.def &&
        (data.meta.id === normalizedWord ||
          data.meta.id.split(":")[0] === normalizedWord)
      )
    })

    const hasUros = fl === "adjective" && uros

    const runons = hasUros
      ? uros.map(({ ure, prs, fl }) => ({
          word: ure,
          pronunciation: prs
            ? {
                audioUrl: this.#createAudioLink(prs[0]),
                transcription: prs[0].mw
              }
            : null,
          part: fl
        }))
      : null

    const definitions = filtered.map(({ hwi, fl, def, ins }) => {
      return {
        word: hwi.hw.replaceAll("*", ""),
        part: fl,
        sences: def
          .map((d) =>
            d.sseq
              .flat()
              .map((sequence) => {
                const [type, collection] = sequence

                if (type === "sense") {
                  return this.#extractDefinitionsWithExamples(sequence)
                }

                if (type === "pseq") {
                  // https://dictionaryapi.com/products/json#sec-2.pseq
                  // bs (such as...) -> sense (1) (2) etc. (examples)
                  return collection.map(this.#extractDefinitionsWithExamples)
                }

                // the rest is not important yet
                return null
              })
              .flat()
              .filter((sense) => sense && sense.def)
          )
          .flat()
      }
    })

    const etymology = et && typeof et[0][1] === "string" ? et[0][1] : null

    const pronunciation = {
      transcription: hwi.prs ? hwi.prs[0].mw : null,
      audioUrl: this.#createAudioLink(hwi.prs[0])
    }

    return {
      word: normalizedWord,
      pronunciation,
      et: etymology,
      definitions,
      runons,
      inflections: ins
    }
  }

  static #transformThesaurus(thesaurus: MWThesaurusResponse | string[]) {
    if (thesaurus.every((item) => typeof item === "string")) {
      return {
        syns: [],
        ants: []
      }
    }

    const [{ meta }] = thesaurus

    return {
      syns: meta.syns ? meta.syns.flat().slice(0, 10) : null,
      ants: meta.ants ? meta.ants.flat().slice(0, 10) : null
    }
  }

  static #transformResponse(
    response: [MWDictionaryResponse, MWThesaurusResponse]
  ): WordInformation {
    const [dictionary, thesaurus] = response

    return {
      ...this.#transformDictionary(dictionary),
      ...this.#transformThesaurus(thesaurus)
    }
  }

  static async getWordInformation(word: string) {
    const [dictionary, thesaurus] = await Promise.all([
      this.#getSelectedLexiconWordInformation(word, "collegiate"),
      this.#getSelectedLexiconWordInformation(word, "thesaurus")
    ])

    if (
      dictionary.every((v) => typeof v === "string") &&
      thesaurus.every((v) => typeof v === "string")
    ) {
      return {
        type: "suggestions" as const,
        data: dictionary
      }
    }

    return {
      type: "found" as const,
      data: this.#transformResponse([
        dictionary as MWDictionaryResponse,
        thesaurus as MWThesaurusResponse
      ])
    }
  }
}

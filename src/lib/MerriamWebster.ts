import type { MWDictionaryResponse } from "~types/mw/dictionary"
import type { MWThesaurusResponse } from "~types/mw/thesaurus"
import type { WordInformation } from "~types/word"

type ApiType = "collegiate" | "thesaurus"

export class MerriamWebster {
  constructor() {}

  static #createAudioLink(headwordInfo: MWDictionaryResponse[number]["hwi"]) {
    // Supported formats: mp3, wav, ogg
    const audioFormat = "mp3"

    if (!headwordInfo.prs || !headwordInfo.prs[0].sound) {
      return null
    }

    const subdirectory = this.#getAudioSubdirectory(headwordInfo.prs[0].sound)

    return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${headwordInfo.prs[0].sound.audio}.${audioFormat}`
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

  static #normalizeWord(word: string) {
    return word.replaceAll("*", "")
  }

  static #transformDictionary(dictionary: MWDictionaryResponse) {
    const [{ hwi, et }] = dictionary

    const normalizedWord = this.#normalizeWord(hwi.hw)

    const filtered = dictionary.filter((data) => {
      return (
        data.meta.id === normalizedWord ||
        data.meta.id.split(":")[0] === normalizedWord
      )
    })

    return {
      word: normalizedWord,
      pronunciation: {
        transcription: hwi.prs ? hwi.prs[0].mw : null,
        audioUrl: this.#createAudioLink(hwi)
      },
      et: et && typeof et[0][1] === "string" ? et[0][1] : null,
      definitions: filtered.map(({ hwi, fl, def }) => ({
        word: this.#normalizeWord(hwi.hw),
        part: fl,
        sences: def
          .map((d) =>
            d.sseq.flat().map((sense) => {
              const [_, { dt }] = sense

              const definition = dt.find((dt) => dt[0] === "text")
              const visualIllustration = dt.find((dt) => dt[0] === "vis")

              return {
                def: definition[1],
                examples: visualIllustration
                  ? visualIllustration[1].map((vis) => vis.t)
                  : []
              }
            })
          )
          .flat()
      }))
    }
  }

  static #transformThesaurus(thesaurus: MWThesaurusResponse) {
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

    try {
      return {
        ...this.#transformDictionary(dictionary),
        ...this.#transformThesaurus(thesaurus)
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  static async getWordInformation(word: string) {
    const [dictionary, thesaurus] = await Promise.all([
      this.#getSelectedLexiconWordInformation(word, "collegiate"),
      this.#getSelectedLexiconWordInformation(word, "thesaurus")
    ])

    if (dictionary.every((v) => typeof v === "string")) {
      return {
        type: "suggestions" as const,
        data: dictionary
      }
    }

    if (thesaurus.every((v) => typeof v === "string")) {
      return {
        type: "suggestions" as const,
        data: thesaurus
      }
    }

    return {
      type: "found" as const,
      data: this.#transformResponse([dictionary, thesaurus])
    }
  }
}

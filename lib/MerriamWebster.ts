import type {
  MWHeadwordInformation,
  MWPronunciationSound
} from "~types/mw/common"
import type { MWDictionaryResponse } from "~types/mw/dictionary"
import type { MWThesaurusResponse } from "~types/mw/thesaurus"

type ApiType = "collegiate" | "thesaurus"

export class MerriamWebster {
  constructor() {}

  static #createAudioLink(headwordInfo: MWHeadwordInformation) {
    // Supported formats: mp3, wav, ogg
    const audioFormat = "mp3"

    if (!headwordInfo.prs || !headwordInfo.prs[0].sound) {
      return null
    }

    const subdirectory = this.#getAudioSubdirectory(headwordInfo.prs[0].sound)

    return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${headwordInfo.prs[0].sound.audio}.${audioFormat}`
  }

  static #getAudioSubdirectory(sound: MWPronunciationSound) {
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
    const [{ hwi, fl, et }] = dictionary

    return {
      word: this.#normalizeWord(hwi.hw),
      part: fl,
      pronunciation: {
        transcription: hwi.prs ? hwi.prs[0].mw : null,
        audioUrl: this.#createAudioLink(hwi)
      },
      et: et ? et[0][1] : null
    }
  }

  static #transformThesaurus(thesaurus: MWThesaurusResponse) {
    // TODO: definitions, examples, synonyms and antonyms from 'def' property
    // TODO: filter all the words that doesn't contain word itself (searching 'class' in thesaurus it pops up the word 'set')

    return thesaurus.map(({ fl, hwi, def }) => ({
      word: this.#normalizeWord(hwi.hw),
      part: fl,
      definitions: def
        .map((d) =>
          d.sseq.flat().map((sence) => {
            const [_, senceData] = sence

            const verbalIllustration = senceData.dt.find(
              (dt) => dt[0] === "vis"
            )
            const wordDefinition = senceData.dt.find((dt) => dt[0] === "text")

            return {
              def: wordDefinition ? wordDefinition[1] : null,
              example: verbalIllustration
                ? verbalIllustration[1].map((t) => t.t)
                : null,
              syns: senceData.sim_list
                ? senceData.sim_list.flat().map((syn) => syn.wd)
                : null,
              ants: senceData.ant_list
                ? senceData.ant_list.flat().map((ant) => ant.wd)
                : senceData.opp_list
                  ? senceData.opp_list.flat().map((opp) => opp.wd)
                  : null
            }
          })
        )
        .flat()
    }))
  }

  static #transformResponse(
    response: [MWDictionaryResponse, MWThesaurusResponse]
  ) {
    const [dictionary, thesaurus] = response

    return {
      ...this.#transformDictionary(dictionary),
      words: this.#transformThesaurus(thesaurus)
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

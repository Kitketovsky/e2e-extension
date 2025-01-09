export const MSG_TYPES = {
  WORD_BACKGROUND: "word_background",
  WORD_FETCH_SUCCESS: "word_fetch_success",
  WORD_FETCH_FAIL: "word_fetch_fail",
  WORD_SUGGESTIONS: "word_suggestions"
} as const

export type MessageType = (typeof MSG_TYPES)[keyof typeof MSG_TYPES]

type CursorPosition = {
  x: number
  y: number
}

interface Message {
  type: MessageType
  position: CursorPosition
}

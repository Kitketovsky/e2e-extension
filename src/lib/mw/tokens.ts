type FormatProps = {
  content: string
  tag: string
  fields: string[]
}

function defaultFormat({ content }: FormatProps) {
  return content
}

function linkFormat({ fields }: FormatProps) {
  const [referenceWordLink] = fields
  const [referenceWord] = referenceWordLink.split(":")
  return referenceWord ?? ""
}

export const tokens: Record<string, (props: FormatProps) => string> = {
  // Formatting and punctuation tokens
  b: ({ content }) => `<b>${content}</b>`,
  bc: defaultFormat,
  inf: ({ content }) => `<sub>${content}</sub>`,
  it: ({ content }) => `<i>${content}</i>`,
  ldquo: defaultFormat,
  rdquo: defaultFormat,
  sc: defaultFormat,
  sup: ({ content }) => `<sup>${content}</sup>`,

  // Word-marking and gloss tokens
  gloss: ({ content }) => `[${content}]`,
  parahw: defaultFormat,
  phrase: ({ content }) => `<i><b>${content}</b></i>`,
  qword: ({ content }) => `<i>${content}</i>`,
  wi: ({ content }) => `<i>${content}</i>`,

  // Cross-reference grouping tokens (may contain 'dxt' tag like {dxt|wildfowl||})
  dx: ({ content }) => `- ${content}`,
  dx_def: ({ content }) => `(${content})`,
  dx_ety: ({ content }) => `- ${content}`,
  ma: ({ content }) => `- more at ${content}`,

  // Cross-reference tokens
  a_link: linkFormat,
  d_link: linkFormat,
  i_link: linkFormat,
  et_link: linkFormat,
  mat: linkFormat,
  sx: linkFormat,
  dxt: linkFormat,

  // Date sense token
  ds: defaultFormat
}

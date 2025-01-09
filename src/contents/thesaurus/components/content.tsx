interface Props {
  wordData: any
}

export const Content = ({ wordData }: Props) => {
  return <span className="break-all">{JSON.stringify(wordData)}</span>
}

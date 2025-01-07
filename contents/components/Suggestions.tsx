interface Props {
  suggestions: string[]
}

export const Suggestions = ({ suggestions }: Props) => {
  return (
    <div>
      {suggestions.map((suggestion) => (
        <span>{suggestion}</span>
      ))}
    </div>
  )
}

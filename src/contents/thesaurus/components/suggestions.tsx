interface Props {
  suggestions: string[]
}

export const Suggestions = ({ suggestions }: Props) => {
  return (
    <div className="bg-white p-4 rounded-lg">
      {suggestions.map((suggestion) => (
        <span>{suggestion}</span>
      ))}
    </div>
  )
}

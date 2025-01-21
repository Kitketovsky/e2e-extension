interface Props {
  error: string
}

export const Error = ({ error }: Props) => {
  return (
    <div>
      <span>{error}</span>
    </div>
  )
}

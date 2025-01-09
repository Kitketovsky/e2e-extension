interface Props {
  error: string
}

export const ErrorMessage = ({ error }: Props) => {
  return (
    <div>
      <span>{error}</span>
    </div>
  )
}

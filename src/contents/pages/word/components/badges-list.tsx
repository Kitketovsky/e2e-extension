import { badgeVariants } from "~components/ui/badge"

interface Props {
  title: string
  list: string[]
  onClick: (listItem: string) => void
}

export function BadgesList({ title, list, onClick }: Props) {
  if (list.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="font-bold">{title}:</span>

      <div className="flex flex-wrap gap-1 text-xs">
        {list.map((item) => (
          <button
            onClick={() => onClick(item)}
            className={badgeVariants({ variant: "secondary" })}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}

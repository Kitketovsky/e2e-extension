import { useClickAway } from "@uidotdev/usehooks"
import { type ReactNode } from "react"

interface Props {
  open: boolean
  onClose: () => void
  children: ReactNode
  position: { x: number; y: number }
}

export const Overlay = ({ open, onClose, position, children }: Props) => {
  const ref = useClickAway<HTMLDivElement>(onClose)

  if (!open || !position) {
    return null
  }

  return (
    <div
      ref={ref}
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
      className="absolute bg-white overflow-hidden text-black p-4 rounded-xl z-50 flex max-w-[370px] max-h-[500px] min-w-[300px]"
    >
      {children}
    </div>
  )
}

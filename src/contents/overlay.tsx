import { Outlet } from "react-router-dom"

import { ScrollArea } from "~components/ui/scroll-area"

import { Navigation } from "./components/navigation"

interface Props {
  open: boolean
  setOverlayEl: React.Dispatch<React.SetStateAction<HTMLElement>>
  position: { x: number; y: number }
}

export function Overlay({ setOverlayEl, position, open }: Props) {
  if (!open) {
    return false
  }

  return (
    <ScrollArea
      style={{ top: `${position?.y}px`, left: `${position?.x}px` }}
      className="bg-white text-black p-4 rounded-xl z-50 flex max-w-[370px] max-h-[500px] min-w-[300px] border border-black"
    >
      <div ref={setOverlayEl} className="flex flex-col gap-4 w-full h-full">
        {/* <Navigation /> */}
        <Outlet />
      </div>
    </ScrollArea>
  )
}

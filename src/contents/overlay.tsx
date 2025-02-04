import { Outlet } from "react-router-dom"

import { ScrollArea } from "~components/ui/scroll-area"

import { OverlaySkeleton } from "./components/overlay-skeleton"
import { CONFIG } from "./config"

interface Props {
  open: boolean
  setOverlayEl: React.Dispatch<React.SetStateAction<HTMLElement>>
  position: { x: number; y: number }
  isLoading: boolean
}

export function Overlay({ setOverlayEl, position, open, isLoading }: Props) {
  if (!open) {
    return false
  }

  return (
    <ScrollArea
      style={{
        position: "fixed",
        maxHeight: `${CONFIG.popup.height}px`,
        maxWidth: `${CONFIG.popup.width}px`,
        top: `${position?.y}px`,
        left: `${position?.x}px`
      }}
      className="bg-white text-black p-4 z-50 flex border border-black w-full overflow-y-auto h-full"
    >
      <div ref={setOverlayEl} className="flex flex-col gap-4 w-full">
        {isLoading ? <OverlaySkeleton /> : <Outlet />}
      </div>
    </ScrollArea>
  )
}

import { Outlet } from "react-router-dom"

import { ScrollArea } from "~components/ui/scroll-area"

import { OverlaySkeleton } from "./components/overlay-skeleton"

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
        top: `${position?.y}px`,
        left: `${position?.x}px`
      }}
      className="bg-white text-black p-4 z-50 flex max-w-[370px] max-h-[500px] min-w-[300px] border border-black w-full overflow-y-auto"
    >
      <div ref={setOverlayEl} className="flex flex-col gap-4 w-full">
        {/* <Navigation /> */}
        {isLoading ? <OverlaySkeleton /> : <Outlet />}
      </div>
    </ScrollArea>
  )
}

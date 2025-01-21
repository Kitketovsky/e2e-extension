import { Outlet } from "react-router-dom"

import { Navigation } from "./components/navigation"

interface Props {
  open: boolean
  setOverlayEl: React.Dispatch<React.SetStateAction<HTMLElement>>
  position: { x: number; y: number }
}

export function Overlay({ setOverlayEl, position }: Props) {
  return (
    <div
      ref={setOverlayEl}
      style={{ top: `${position?.y}px`, left: `${position?.x}px` }}
      className="fixed bg-white overflow-y-scroll text-black p-4 rounded-xl z-50 flex max-w-[370px] max-h-[500px] min-w-[300px] border border-black"
    >
      <div className="flex flex-col gap-4 w-full h-full">
        <Navigation />
        <Outlet />
      </div>
    </div>
  )
}

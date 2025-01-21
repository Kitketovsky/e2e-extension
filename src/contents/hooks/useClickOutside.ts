import { useEffect } from "react"

interface Props {
  element: HTMLElement | null
  onClickOutside: () => void
}

export function useClickOutside({ element, onClickOutside }: Props) {
  useEffect(() => {
    function onClick(event) {
      if (element && !element.contains(event.target)) {
        onClickOutside()
      }
    }

    document.body.addEventListener("mousedown", onClick)

    return () => {
      document.body.removeEventListener("mousedown", onClick)
    }
  }, [element])
}

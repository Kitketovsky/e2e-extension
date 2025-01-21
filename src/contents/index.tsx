import tailwindCssText from "data-text:~style.css"
import type { PlasmoGetStyle } from "plasmo"
import { MemoryRouter, Route, Routes } from "react-router-dom"

import { ExtensionRouting } from "./routes/ExtensionRouting"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = tailwindCssText
  return style
}

function Main() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/*" element={<ExtensionRouting />} />
      </Routes>
    </MemoryRouter>
  )
}

export default Main

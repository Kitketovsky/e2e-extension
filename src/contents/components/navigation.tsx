import { NavLink, useLocation } from "react-router-dom"

import { ROUTES } from "~contents/routes/routes"

// TODO: redesign
export const Navigation = () => {
  const { pathname } = useLocation()

  return (
    <nav>
      {pathname === ROUTES.DICTIONARY ? (
        <NavLink to={ROUTES.MAIN}>Go back</NavLink>
      ) : (
        <NavLink to={ROUTES.DICTIONARY}>Dictionary</NavLink>
      )}
    </nav>
  )
}

import Toolbar from "./Toolbar.tsx"
import { Outlet } from 'react-router-dom'

function AppView() {
  return (
    <>
      <div className="w-full">
        <Toolbar />
      </div>
      <div>
        <Outlet />
      </div>
    </>
  )
}

export default AppView

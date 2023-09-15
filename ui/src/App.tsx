import Nav from "./Nav.tsx"
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
      <div className="w-full">
        <Nav />
      </div>
      <div>
        <Outlet />
      </div>
    </>
  )
}

export default App

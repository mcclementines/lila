import Nav from "./Nav.tsx";
import { Outlet } from "react-router-dom";
import usePageTracking from "./PageTracking.tsx";

function App() {
  usePageTracking();

  return (
    <>
      <div className="w-full">
        <Nav />
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default App;

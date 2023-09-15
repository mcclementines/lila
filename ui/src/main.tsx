import "./index.css"
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import Home from './Home.tsx'
import CreateAccount from './CreateAccount.tsx'
import Login from './Login.tsx'
import SentenceCompletion from "./GRE/SentenceCompletion.tsx"
import GREHome from "./GRE/GREHome.tsx"


const root = createBrowserRouter ([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/createAccount",
        element: <CreateAccount />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/gre",
        element: <GREHome />
      },
      {
        path: "/gre/completion",
        element: <SentenceCompletion />,
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={root} />
  </React.StrictMode>,
)

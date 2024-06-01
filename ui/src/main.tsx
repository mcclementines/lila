import "./index.css"
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ReactGA from 'react-ga4'
import App from './App.tsx'
import AppView from './AppView.tsx'
import Home from './Home.tsx'
import About from "./About.tsx"
import CreateAccount from './CreateAccount.tsx'
import Login from './Login.tsx'
import SentenceCompletion from "./GRE/SentenceCompletion.tsx"
import GREHome from "./GRE/GREHome.tsx"

ReactGA.initialize("G-9GKMWWLJE6");
ReactGA.send({hitType: "", page: window.location.pathname + window.location.search, title: window.location.pathname});

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
        path: "/about",
        element: <About />
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
    ]
  },
  {
    path: "/",
    element: <AppView />,
    children: [
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

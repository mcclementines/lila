import './App.css'
import Nav from "./Nav.tsx"
import ActionButton from "./ActionButton.tsx"

function App() {
  return (
    <>
      <div className="w-full">
        <Nav />
      </div>
      <div className="w-full h-[calc(100vh_-_4rem)] justify-center px-8">
        <div className="flex h-[50vh]">
          <h1 className="text-center m-auto text-4xl font-work-sans">
            Test prep books are so ______ boring, I just want to practice!
          </h1>
        </div>
        <div className="flex flex-col h-[calc(50vh_-_4rem)]">
          <div className="flex-1">
            <h1 className="justify-center text-center text-3xl font-work-sans">
              No Gimmicks. No Tricks. Just unlimited practice.
            </h1>
          </div>
          <div className="flex-none w-full mb-4">
            <div className="flex flex-col justify-center space-y-2">
              <ActionButton link="/createAccount" text="LET'S GO!"/>
              <ActionButton link="/login" text="I ALREADY HAVE AN ACCOUNT"/>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App

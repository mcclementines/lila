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
        <div className="flex h-[55vh]">
          <h1 className="text-center m-auto text-5xl font-work-sans">
            Test prep books are so ______ boring, I just want to practice!
          </h1>
        </div>
        <div>
          <div className="flex h-[25vh]">
            <h1 className="text-center text-4xl font-work-sans">
              No Gimmicks. No Tricks. Just unlimited practice.
            </h1>
          </div>
          <div className="flex flex-col w-full justify-center space-y-2">
            <ActionButton link="/createAccount" text="LET'S GO!"/>
            <ActionButton link="/login" text="I ALREADY HAVE AN ACCOUNT"/>
          </div>
        </div>
      </div>
    </>
  )
}

export default App

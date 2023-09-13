import './App.css'
import Nav from "./Nav.tsx"
import ActionButton from "./ActionButton.tsx"

function App() {
  return (
    <>
      <div className="w-full">
        <Nav />
      </div>
      <div className="w-full max-w-lg h-[calc(calc(var(--vh,1vh)_*_100)_-_4rem)] justify-center px-8 mx-auto">
        <div className="flex h-[calc(var(--vh,1vh)_*_50)]">
          <div className='flex mx-auto mt-auto bg-indigo-600 rounded-3xl drop-shadow-xl border-b-8 border-indigo-700 p-12'>
            <h1 className="text-center m-auto text-4xl text-white font-work-sans">
              Test prep books are so <span className='underline whitespace-pre'>          </span> boring, I just want to practice!
            </h1>
          </div>
        </div>
        <div className="flex flex-col h-[calc(calc(var(--vh,1vh)_*_50)_-_4rem)]">
          <div className="flex-1">
            <h1 className="justify-center text-center text-3xl mt-8 text-gray-800 font-work-sans">
              No Tricks. No Gimmicks. Just unlimited practice.
            </h1>
          </div>
          <div className="flex-none w-full mb-4">
            <div className="flex flex-col justify-center space-y-2">
              <ActionButton color="primary" link="/createAccount" text="LET'S GET STARTED"/>
              <ActionButton color="secondary" link="/login" text="I ALREADY HAVE AN ACCOUNT"/>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App

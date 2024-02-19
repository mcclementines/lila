import ActionButton from "../ActionButton"
import useCompletionAPI from "./completionAPI";

function SentenceCompletion() {
  const [error, isLoaded, data, _] = useCompletionAPI();


  if (error) {
    return (
      <div>
        <p className="text-2xl">Something is wrong! Please try again later.</p>
      </div>
    )
  } else if (!isLoaded) {
    return ( <div>
        <p className="text-2xl">Loading...</p>
      </div>
    )
  } else {
    return (
      <>
        <div className="w-full max-w-lg h-[calc(calc(var(--vh,1vh)_*_100)_-_4rem)] justify-center px-8 mx-auto">
          <div className="flex h-[calc(var(--vh,1vh)_*_50)]">
            <div className='flex mx-auto mt-auto bg-indigo-600 rounded-3xl drop-shadow-xl border-b-8 border-indigo-700 p-12'>
              <h1 className="text-center m-auto text-3xl text-white font-work-sans">
                {data ? (data.Sentence) : (<p>No Data Available</p>)}
              </h1>
            </div>
          </div>
          <div className="flex flex-col h-[calc(calc(var(--vh,1vh)_*_50)_-_4rem)]">
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
}

export default SentenceCompletion

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
    return (<div>
      <p className="text-2xl">Loading...</p>
    </div>
    )
  } else {
    return (
      <>
        <div className="w-full h-[calc(calc(var(--vh,1vh)*100)-4rem)] flex justify-center items-center">
          <div className="max-w-lg w-full px-4 md:px-8 mx-auto flex flex-col" style={{ height: '80vh' }}>
            <div className='bg-indigo-600 rounded-3xl drop-shadow-xl border-b-8 border-indigo-700 p-4 md:p-8 mb-4'>
              <h1 className="text-center text-xl md:text-3xl text-white font-work-sans">
                {data ? (data.Sentence) : (<p>No Data Available</p>)}
              </h1>
            </div>
            <div className="mt-auto mb-auto space-y-2">
              {data ? (data.Choices.map((choice, index) => (
                <ActionButton color="secondary" link="/login" text={choice} key={index} />
              ))) : (<div></div>)}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default SentenceCompletion

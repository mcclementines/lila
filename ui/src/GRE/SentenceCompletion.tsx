import useCompletionAPI from "./completionAPI";
import { useNavigate } from 'react-router-dom';

function SentenceCompletion() {
  const [error, isLoaded, data, _] = useCompletionAPI();
  const navigate = useNavigate();

  if (error) {
    return (
      <>
        <div className="w-full h-[calc(calc(var(--vh,1vh)*100)-4rem)] flex justify-center items-center">
          <div className="max-w-lg w-full px-4 md:px-8 mx-auto flex flex-col" style={{ height: '80vh' }}>
            <p className="text-center text-3xl font-work-sans mt-auto mb-[70%]">Something is wrong! Please try again later.</p>
          </div>
        </div>
      </>
    )
  } else if (!isLoaded) {
    return (
      <>
        <div className="w-full h-[calc(calc(var(--vh,1vh)*100)-4rem)] flex justify-center items-center">
          <div className="max-w-lg w-full px-4 md:px-8 mx-auto flex flex-col" style={{ height: '80vh' }}>
            <p className="sr-only text-center text-xl md:text-3xl font-work-sans">Loading...</p>
            <div className="flex flex-row space-x-2 mx-auto pt-20"> 
              <div className='h-6 w-6 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
              <div className='h-6 w-6 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
              <div className='h-6 w-6 bg-indigo-600 rounded-full animate-bounce'></div>
            </div>
          </div>
        </div>
      </>
    )
  } else {
    navigate("/gre/completion/" + data?.key);
  }
}

export default SentenceCompletion

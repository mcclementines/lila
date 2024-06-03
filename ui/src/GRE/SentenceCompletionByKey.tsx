import reactStringReplace from 'react-string-replace';
import ActionButton from "../ActionButton";
import { useEffect, useState } from 'react';
import Selected from './SentenceCompletion';
import { useNavigate, useParams } from 'react-router-dom';
import useCompletionByKeyAPI, { SentenceCompletionWithMeta } from './completionByKeyAPI';

interface Selected {
  key: number;
  isCorrect: boolean | null;
}

function processColor(key: number, selected: Selected, data: SentenceCompletionWithMeta) : string {
  if (selected.key != -1 && selected.key === key) {
    if (selected.isCorrect) {
      return "green";
    } else {
      return "red";
    }
  } else if (selected.key != -1) {
    if (data?.sentence_completion.Choices[key] == data?.sentence_completion.Word) return "green";
    return "gray";
  }

  return "secondary";
}

function SentenceCompletionByKey() {
  const [selected, setSelected] = useState<Selected>({key: -1, isCorrect: null});
  const { key } = useParams();
  const navigate = useNavigate();
  const [error, isLoaded, data] = useCompletionByKeyAPI(key);

  useEffect(() => {
    if (selected.key != -1) {
      const reload = setTimeout(() => {
        navigate("/gre/completion");
      }, 1500);

      return () => clearTimeout(reload);
    }
  }, [selected, navigate])

  function handleClick(key: number) {
    let isCorrect = false;

    if (data?.sentence_completion.Choices[key] === data?.sentence_completion.Word) {
      isCorrect = true;
    }

    setSelected({key: key, isCorrect: isCorrect});
  }

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
    return (
      <>
        <div className="w-full h-[calc(calc(var(--vh,1vh)*100)-4rem)] flex justify-center items-center">
          <div className="max-w-lg w-full h-full px-4 md:px-8 mx-auto flex flex-col">
            <div className='bg-indigo-600 rounded-3xl drop-shadow-xl border-b-8 border-indigo-700 p-4 md:p-8 my-auto'>
              <h1 className="text-center text-xl md:text-3xl text-white font-work-sans">
                {data ? (reactStringReplace(data.sentence_completion.Sentence, /@+/g, (match,i) => (
                  <span key={i}>
                    <span className='underline whitespace-pre'>
                      {" ".repeat(14)}
                    </span>
                    {match.length > 0 && match[0].match(/^[a-z0-9]+$/i) ? " " : ""}{match}
                  </span>
                ))) : 
                  (
                    <div className="w-full h-[calc(calc(var(--vh,1vh)*100)-4rem)] flex justify-center items-center">
                      <div className="max-w-lg w-full px-4 md:px-8 mx-auto flex flex-col" style={{ height: '80vh' }}>
                        <p className="text-center text-3xl font-work-sans mt-auto mb-[70%]">Something is wrong! Please try again later.</p>
                      </div>
                    </div>
                  )
                }
              </h1>
            </div>
            <div className="mt-auto mb-auto space-y-2">
              {data ? (data.sentence_completion.Choices.map((choice, index) => (
                <ActionButton color={processColor(index, selected, data)} text={choice} key={index} onClick={() => handleClick(index)}/>
              ))) : (<div></div>)}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default SentenceCompletionByKey

import reactStringReplace from "react-string-replace";
import ActionButton from "../ActionButton";
import { useCallback, useEffect, useRef, useState } from "react";
import Selected from "./SentenceCompletion";
import { useNavigate, useParams } from "react-router-dom";
import {
  SentenceCompletionWithMeta,
  loadCompletionByKey,
  recordCompletionResult,
} from "./completionAPI";
import { genCompletionKey } from "./completionAPI";

interface Selected {
  id: number;
  isCorrect: boolean | null;
}

function processColor(
  key: number,
  selected: Selected,
  data: SentenceCompletionWithMeta,
): string {
  if (selected.id != -1 && selected.id === key) {
    if (selected.isCorrect) {
      return "green";
    } else {
      return "red";
    }
  } else if (selected.id != -1) {
    if (
      data?.sentence_completion.Choices[key] == data?.sentence_completion.Word
    )
      return "green";
    return "gray";
  }

  return "secondary";
}

function SentenceCompletionByKey() {
  const { key } = useParams();
  const navigate = useNavigate();

  const initialLoad = useRef<boolean>(false);
  const generatingKey = useRef<boolean>(false);
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<SentenceCompletionWithMeta | null>(null);
  const [keys, setKeys] = useState<string[]>([]);
  const [selected, setSelected] = useState<Selected>({
    id: -1,
    isCorrect: null,
  });
  const [startTime, setStartTime] = useState<number>(0);
  const [currentKey, setCurrentKey] = useState<string>("");

  const loadKey = useCallback(
    async (key: string) => {
      const completion = await loadCompletionByKey(key);

      setData(completion);
      setSelected({ id: -1, isCorrect: null });
      setIsLoaded(true);
      setStartTime(new Date().getTime());
      setCurrentKey(key);
      navigate(`/gre/completion/${completion.key}`, { replace: true });
    },
    [navigate],
  );

  const genKey = useCallback(async (id?: number): Promise<string> => {
    if (id == undefined) id = 0;

    return genCompletionKey(id);
  }, []);

  // load initial key
  useEffect(() => {
    if (initialLoad.current) return;

    const initialKeys = async () => {
      try {
        const keys = await Promise.all([1, 2].map((id) => genKey(id)));
        console.log(keys);
        setKeys(keys);
      } catch (error) {
        console.log(error);

        setError(true);
      }
    };

    if (key === undefined) {
      const initialKey = async () => {
        try {
          const key = await genKey();
          await loadKey(key);
        } catch (error) {
          console.log(error);
          setError(true);
        }
      };

      initialKey();
      initialKeys();
      initialLoad.current = true;

      return;
    }

    loadKey(key);
    initialKeys();
    initialLoad.current = true;
  }, [genKey, loadKey, key]);

  useEffect(() => {
    if (keys.length < 2) {
      if (generatingKey.current) return;
      generatingKey.current = true;

      const addKey = async () => {
        try {
          const key = await genKey();
          setKeys((keys) => [...keys, key]);
        } catch (error) {
          console.log(error);

          setError(true);
        }

        generatingKey.current = false;
      };
      addKey();
    }
  }, [keys, genKey]);

  // load next key
  useEffect(() => {
    if (selected.id != -1) {
      const reload = setTimeout(() => {
        const loadNextKey = async () => {
          try {
            let key: string;

            if (keys.length < 1) {
              key = await genKey();
            } else {
              key = keys[0];
              setKeys((keys) => keys.slice(1));
            }

            await loadKey(key);
          } catch (error) {
            console.log(error);
            setError(true);
          }
        };

        loadNextKey();
      }, 1500);

      return () => clearTimeout(reload);
    }
  }, [selected, genKey, loadKey, keys]);

  function handleClick(id: number) {
    let isCorrect = data?.sentence_completion.Choices[id] === data?.sentence_completion.Word;
    
    recordCompletionResult(currentKey, isCorrect, new Date().getTime() - startTime);

    setSelected({ id: id, isCorrect: isCorrect });
  }

  if (error) {
    return (
      <>
        <div className="w-full h-[calc(calc(var(--vh,1vh)*100)-4rem)] flex justify-center items-center">
          <div
            className="max-w-lg w-full px-4 md:px-8 mx-auto flex flex-col"
            style={{ height: "80vh" }}
          >
            <p className="text-center text-3xl font-work-sans mt-auto mb-[70%]">
              Something is wrong! Please try again later.
            </p>
          </div>
        </div>
      </>
    );
  } else if (!isLoaded) {
    return (
      <>
        <div className="w-full h-[calc(calc(var(--vh,1vh)*100)-4rem)] flex justify-center items-center">
          <div
            className="max-w-lg w-full px-4 md:px-8 mx-auto flex flex-col"
            style={{ height: "80vh" }}
          >
            <p className="sr-only text-center text-xl md:text-3xl font-work-sans">
              Loading...
            </p>
            <div className="flex flex-row space-x-2 mx-auto pt-20">
              <div className="h-6 w-6 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-6 w-6 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-6 w-6 bg-indigo-600 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="w-full h-[calc(calc(var(--vh,1vh)*100)-4rem)] flex justify-center items-center">
          <div className="max-w-lg w-full h-full px-4 md:px-8 mx-auto flex flex-col">
            <div className="bg-indigo-600 rounded-3xl drop-shadow-xl border-b-8 border-indigo-700 p-4 md:p-8 my-auto">
              <h1 className="text-center text-xl md:text-3xl text-white font-work-sans">
                {data ? (
                  reactStringReplace(
                    data.sentence_completion.Sentence,
                    /@+/g,
                    (match, i) => (
                      <span key={i}>
                        <span className="underline whitespace-pre">
                          {" ".repeat(14)}
                        </span>
                        {match.length > 0 && match[0].match(/^[a-z0-9]+$/i)
                          ? " "
                          : ""}
                        {match}
                      </span>
                    ),
                  )
                ) : (
                  <div className="w-full h-[calc(calc(var(--vh,1vh)*100)-4rem)] flex justify-center items-center">
                    <div
                      className="max-w-lg w-full px-4 md:px-8 mx-auto flex flex-col"
                      style={{ height: "80vh" }}
                    >
                      <p className="text-center text-3xl font-work-sans mt-auto mb-[70%]">
                        Something is wrong! Please try again later.
                      </p>
                    </div>
                  </div>
                )}
              </h1>
            </div>
            <div className="mt-auto mb-auto space-y-2">
              {data ? (
                data.sentence_completion.Choices.map((choice, index) => (
                  <ActionButton
                    color={processColor(index, selected, data)}
                    text={choice}
                    key={index}
                    onClick={() => handleClick(index)}
                  />
                ))
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default SentenceCompletionByKey;

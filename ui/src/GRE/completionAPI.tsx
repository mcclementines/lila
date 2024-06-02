import { useCallback, useEffect, useState } from "react";
import axios from 'axios';

type Completion = {
  Sentence: string;
  Word: string;
  Choices: string[];
}

type SentenceCompletionWithMeta = {
  key: string;
  views: number;
  created_date: string;
  sentence_completion: Completion;
}

type UseCompletionAPIReturn = [
error: null | boolean,
isLoaded: boolean,
data: null | SentenceCompletionWithMeta,
getNext: () => void
];

function useCompletionAPI(): UseCompletionAPIReturn {
  const [error, setError] = useState<null | boolean>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<null | SentenceCompletionWithMeta>(null);
  const [next, setNext] = useState(true);

  const getNext = useCallback(() => {
    setError(null);
    setIsLoaded(false);
    setData(null);
    setNext(true);
  }, []);

  useEffect(() => {
    if (next === true) {
      (async () => {
        axios.get<SentenceCompletionWithMeta>(import.meta.env.VITE_REACT_APP_API_URL + "/completion")
          .then(response => {
            setData(response.data);
          })
          .catch(error => {
            console.error(error.message);
            setError(true);
          })
          .finally(() => {
            setIsLoaded(true);
            setNext(false);
          });
      })();
    }
  }, [next]);

  return [error, isLoaded, data, getNext];
}

export default useCompletionAPI;

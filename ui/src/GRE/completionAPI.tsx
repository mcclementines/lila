import { useCallback, useEffect, useState } from "react";
import axios from 'axios';

type Completion = {
  Sentence: string;
  Word: string;
  Choices: string[];
}

type UseCompletionAPIReturn = [
error: null | boolean,
isLoaded: boolean,
data: null | Completion,
getNext: () => void
];

function useCompletionAPI(): UseCompletionAPIReturn {
  const [error, setError] = useState<null | boolean>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<null | Completion>(null);
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
        axios.get<Completion>("http://localhost:8000/completion")
          .then(response => setData(response.data))
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

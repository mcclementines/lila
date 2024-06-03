import { useEffect, useState } from "react";
import axios from 'axios';

type Completion = {
  Sentence: string;
  Word: string;
  Choices: string[];
}

export type SentenceCompletionWithMeta = {
  key: string;
  views: number;
  created_date: string;
  sentence_completion: Completion;
}

type UseCompletionByKeyAPIReturn = [
error: null | boolean,
isLoaded: boolean,
data: null | SentenceCompletionWithMeta,
];

function useCompletionByKeyAPI(key: string | undefined): UseCompletionByKeyAPIReturn {
  const [error, setError] = useState<null | boolean>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<null | SentenceCompletionWithMeta>(null);

  useEffect(()=>{
    if (key === undefined) {
      setError(true);
    } else {
      (async () => { 
        axios.get<SentenceCompletionWithMeta>(import.meta.env.VITE_REACT_APP_API_URL + "/completion/" + key)
          .then(response => {
            setData(response.data);
          })
          .catch(error => {
            console.error(error.message);
            setError(true);
          })
          .finally(() => {
            setIsLoaded(true);
          });
      })();
    }
  }, [key])

  return [error, isLoaded, data];
}

export default useCompletionByKeyAPI;

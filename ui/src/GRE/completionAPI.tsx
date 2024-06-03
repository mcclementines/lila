import { useEffect, useState } from "react";
import axios from "axios";

type Key = {
  key: string;
};

type UseCompletionAPIReturn = [
  error: null | boolean,
  isLoaded: boolean,
  data: null | Key,
];

function useCompletionAPI(): UseCompletionAPIReturn {
  const [error, setError] = useState<null | boolean>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<null | Key>(null);

  useEffect(() => {
    (async () => {
      axios
        .get<Key>(import.meta.env.VITE_REACT_APP_API_URL + "/completion")
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error(error.message);
          setError(true);
        })
        .finally(() => {
          setIsLoaded(true);
        });
    })();
  }, []);

  return [error, isLoaded, data];
}

export default useCompletionAPI;

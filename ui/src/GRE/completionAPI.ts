import axios from "axios";

type Key = {
  key: string;
};

type Completion = {
  Sentence: string;
  Word: string;
  Choices: string[];
};

export type SentenceCompletionWithMeta = {
  key: string;
  views: number;
  created_date: string;
  sentence_completion: Completion;
};

export function loadCompletionByKey(
  key: string | undefined,
): Promise<SentenceCompletionWithMeta> {
  return new Promise((resolve, reject) => {
    axios
      .get<SentenceCompletionWithMeta>(
        import.meta.env.VITE_REACT_APP_API_URL + "/completion/" + key,
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error.message);
        reject(error);
      });
  });
}

export function genCompletionKey(id: number): Promise<string> {
  return new Promise((resolve, reject) => {
    axios
      .get<Key>(import.meta.env.VITE_REACT_APP_API_URL + "/completion", {
        params: {
          id: new Date().getTime() + id,
        },
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
      .then((response) => {
        resolve(response.data.key);
      })
      .catch((error) => {
        console.error(error.message);
        reject(error);
      });
  });
}

export function recordCompletionResult(key: string, correct: boolean, timeToComplete: number) {
  const params = new URLSearchParams();
  params.append("key", key);
  params.append("is_correct", String(correct));
  params.append("completion_time", timeToComplete.toString());
  
  return new Promise((resolve, reject) => {
    axios
      .post(
        import.meta.env.VITE_REACT_APP_API_URL + "/completion/stats/update",
        params
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error.message);
        reject(error);
      });
  });
}

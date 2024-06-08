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

export function genCompletionKey(): Promise<string> {
  return new Promise((resolve, reject) => {
    axios
      .get<Key>(import.meta.env.VITE_REACT_APP_API_URL + "/completion")
      .then((response) => {
        resolve(response.data.key);
      })
      .catch((error) => {
        console.error(error.message);
        reject(error);
      });
  });
}

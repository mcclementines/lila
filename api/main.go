package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	random "math/rand"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gorilla/mux"
	openai "github.com/sashabaranov/go-openai"
)

type WordDef struct {
	Word       string
	Type       string
	Definition string
}

type ModelOut_SentenceCompletion struct {
  Sentence string
  Word     string
}

type SentenceCompletion struct {
	Sentence string
	Word     string
	Choices  []string
}

func main() {
	r := mux.NewRouter()
	api := r.PathPrefix("/api").Subrouter()
	api_v1 := api.PathPrefix("/v1").Subrouter()

	api_v1.HandleFunc("/completion", func(w http.ResponseWriter, r *http.Request) {
		model := get_model(r.URL.Query().Get("model"))
    completion, err := generate_completion(model)

		if err != nil {
			fmt.Printf("CompletionError: %s", err)
			return
		}

		resp, err := json.Marshal(completion)

		if err != nil {
			fmt.Printf("MarshallError: %s", err)
			return
		}

		fmt.Fprintf(w, "%s\n", resp)
	})

	http.ListenAndServe(":8000", r)
}

func get_random() *random.Rand {
	return random.New(random.NewSource(time.Now().UTC().UnixMicro()))
}

func get_openai() *openai.Client {
	return openai.NewClient(os.Getenv("OPENAI_KEY"))
}

func get_model(model string) string {
  switch model {
  case "sentence-completion":
    // Completion pair models (retired
    // return "davinci:ft-personal-2022-09-24-21-16-53" // v1
    // return "davinci:ft-personal-2023-08-22-05-09-16" // v2
    
    // Chat completion models
    return "ft:gpt-3.5-turbo-0613:personal::7qZZMuwb" // v1
  default:
    return "ft:gpt-3.5-turbo-0613:personal::7qZZMuwb"
  }
}

func get_dictionary(file string) []WordDef {
	content, err := os.ReadFile(file)

	if err != nil {
		log.Fatal("Could not load vocab list.")
	}

	var payload []WordDef
	err = json.Unmarshal(content, &payload)

	if err != nil {
		log.Fatal("Error during Unmarshal(): ", err)
	}

	return payload
}

func filter_dictionary_by_type(dictionary []WordDef, word_type string) []WordDef {
	var filtered []WordDef

	for _, word := range dictionary {
		if word.Type == word_type {
			filtered = append(filtered, word)
		}
	}

	return filtered
}

func unmarshal_modelout_sentencecompletion(result string) ModelOut_SentenceCompletion {
  var payload ModelOut_SentenceCompletion
  
  log.Print("Respose from sentence completion model: " + result)

  err := json.Unmarshal([]byte(result), &payload)

  if err != nil {
		log.Fatal("Error during Unmarshal(): ", err)
  }

  return payload
}

func generate_completion(model string) (SentenceCompletion, error) {
  ai := get_openai()
  dictionary := get_dictionary("./static/gre_vocab_list.json")
  rand := get_random()

	word := dictionary[rand.Intn(len(dictionary))] 

  resp, err := ai.CreateChatCompletion(context.Background(),
		openai.ChatCompletionRequest{
			Model:       model,
			Messages:    []openai.ChatCompletionMessage {
        {
          Role: openai.ChatMessageRoleSystem,
          Content: "Respond in JSON",
        },
        {
          Role: openai.ChatMessageRoleUser,
          Content: fmt.Sprintf("WORD: %s\n\n###\n\n", word.Word),
        },
      },
			Stop:        []string{"###"},
			Temperature: .6,
			MaxTokens:   128,
		},
	)

	if err != nil {
		return SentenceCompletion{}, err
	}

	mo_completion := unmarshal_modelout_sentencecompletion(strings.Trim(resp.Choices[0].Message.Content, " "))

	filtered_dictionary := filter_dictionary_by_type(dictionary, word.Type)
	choices := generate_choices(filtered_dictionary, word, 4)

	return SentenceCompletion{Sentence: mo_completion.Sentence, Word: mo_completion.Word, Choices: choices}, nil
}

func generate_choices(dict []WordDef, word WordDef, length int) []string {
	var choices []string

  rand := get_random()

	for len(choices) < length {
		var choice string

		for choice == "" || choice == word.Word {
			choice = dict[rand.Intn(len(dict))].Word
		}

		choices = append(choices, choice)
	}

	return choices
}



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

type Completion struct {
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
  case "prototype-v1":
    return "davinci:ft-personal-2022-09-24-21-16-53"
  default:
    return "davinci:ft-personal-2022-09-24-21-16-53"
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

func generate_completion(model string) (Completion, error) {
  ai := get_openai()
  dictionary := get_dictionary("./static/gre_vocab_list.json")
  rand := get_random()

	word := dictionary[rand.Intn(len(dictionary))] 

  resp, err := ai.CreateCompletion(context.Background(),
		openai.CompletionRequest{
			Model:       model,
			Prompt:      fmt.Sprintf("WORD: %s\n\n###\n\n", word),
			Stop:        []string{"###"},
			Temperature: .6,
			MaxTokens:   64,
		},
	)

	if err != nil {
		return Completion{}, err
	}

	sentence := strings.Trim(resp.Choices[0].Text, " ")

	filtered_dictionary := filter_dictionary_by_type(dictionary, word.Type)
	choices := generate_choices(filtered_dictionary, word, 4)

	return Completion{Sentence: sentence, Word: word.Word, Choices: choices}, nil
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

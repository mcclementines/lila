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
	models := map[string]string{
		"prototype-v1": "davinci:ft-personal-2022-09-24-21-16-53",
	}

	ai := openai.NewClient(os.Getenv("OPENAI_KEY"))
	dictionary := load_json("./static/gre_vocab_list.json")

	rand := random.New(random.NewSource(time.Now().UTC().UnixMicro()))

	r := mux.NewRouter()
	api := r.PathPrefix("/api").Subrouter()
	api_v1 := api.PathPrefix("/v1").Subrouter()

	api_v1.HandleFunc("/completion", func(w http.ResponseWriter, r *http.Request) {
		model := models[r.URL.Query().Get("model")]
		word := dictionary[rand.Intn(len(dictionary))]

		// replace with middleware
		fmt.Printf("word: %s\n", word)

		resp, err := ai.CreateCompletion(
			context.Background(),
			openai.CompletionRequest{
				Model:       model,
				Prompt:      fmt.Sprintf("WORD: %s\n\n###\n\n", word),
				Stop:        []string{"###"},
				Temperature: .6,
				MaxTokens:   64,
			},
		)

		if err != nil {
			fmt.Printf("ChatCompletionError: %s", err)
			return
		}

		sentence := strings.Trim(resp.Choices[0].Text, " ")

		completion := generate_completion(sentence, word, 
      generate_choices(rand, filter_dictionary_by_type(dictionary, word.Type), word, 4))
		response, err := json.Marshal(completion)

		if err != nil {
			fmt.Printf("MarshallError: %s", err)
			return
		}

		fmt.Fprintf(w, "%s\n", response)
	})

	http.ListenAndServe(":8000", r)
}

func load_json(file string) []WordDef {
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

func generate_completion(sentence string, word WordDef, choices []string) Completion {
	return Completion{Sentence: sentence, Word: word.Word, Choices: choices}
}

func generate_choices(rand *random.Rand, dict []WordDef, word WordDef, length int) []string {
	var choices []string

	for len(choices) < length {
		var choice string

		for choice == "" || choice == word.Word {
			choice = dict[rand.Intn(len(dict))].Word
		}

		choices = append(choices, choice)
	}

	return choices
}

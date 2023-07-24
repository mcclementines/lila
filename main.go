package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strings"

	"github.com/gorilla/mux"
	openai "github.com/sashabaranov/go-openai"
)

type WordDef struct {
	Word string
	Type string
	Definition string
}

type Completion struct {
	Sentence string
	Word     string
	Choices  []string
}

func main() {
	ai := openai.NewClient(os.Getenv("OPENAI_KEY"))
	dictionary := load_json("./static/gre_vocab_list.json")

	r := mux.NewRouter()
	api := r.PathPrefix("/api").Subrouter()
	api_v1 := api.PathPrefix("/v1").Subrouter()
	
	api_v1.HandleFunc("/completion", func(w http.ResponseWriter, r *http.Request) {
		word := dictionary[rand.Intn(len(dictionary))]

		// replace with middleware
		fmt.Printf("word: %s\n", word)

		resp, err := ai.CreateCompletion(
			context.Background(),
			openai.CompletionRequest{
				Model:       "davinci:ft-personal-2022-09-24-21-16-53",
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

		completion := generate_completion(sentence, word.Word)
		response, err := json.Marshal(completion)

		if err != nil {
			fmt.Printf("MarshallError: %s", err)
			return
		}

		fmt.Fprintf(w, "%s\n", response)
	})

	http.ListenAndServe(":1337", r)
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

func generate_completion(sentence string, word string) Completion {
	return Completion{Sentence:  sentence, Word: word, Choices: []string{}}
}

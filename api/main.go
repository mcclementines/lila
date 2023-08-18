package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	openai "github.com/sashabaranov/go-openai"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"time"
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

	random := rand.New(rand.NewSource(time.Now().UTC().UnixMicro()))

	r := mux.NewRouter()
	api := r.PathPrefix("/api").Subrouter()
	api_v1 := api.PathPrefix("/v1").Subrouter()

	api_v1.HandleFunc("/completion", func(w http.ResponseWriter, r *http.Request) {
		model := models[r.URL.Query().Get("model")]
		word := dictionary[random.Intn(len(dictionary))]

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

		completion := generate_completion(sentence, word.Word)
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

func generate_completion(sentence string, word string) Completion {
	return Completion{Sentence: sentence, Word: word, Choices: []string{}}
}


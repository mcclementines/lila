package main

import (
	"testing"
)

func TestGenerateCompletion(t *testing.T) {
	actual := generate_completion("This is only a test.", "test")
	expected := Completion{Sentence: "This is only a test.", Word: "test", Choices: []string{}}

	if actual.Sentence != expected.Sentence || actual.Word != expected.Word {
		t.Errorf("Expected %q, got %q", expected, actual)
	}
}

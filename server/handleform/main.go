package main

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("POST /firestore", firestoreHandler)
	http.HandleFunc("/", indexHandler)
	fmt.Println("starting server on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}

type reqPayload struct {
	UserID string
	Token  string
}

func firestoreHandler(w http.ResponseWriter, r *http.Request) {
	dec := json.NewDecoder(r.Body)
	payload := reqPayload{}
	if err := dec.Decode(&payload); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "error decoding request: %v", err)
		return
	}
	fmt.Fprintf(w, "Hello from firestore handler. Decoded payload: %#v", payload)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	w.Write(indexHTML)
}

//go:embed index.html
var indexHTML []byte

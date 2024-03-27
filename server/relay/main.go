package main

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"io"
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

	// send request to Firestore
	firestoreURL := "https://firestore.googleapis.com/v1/projects/drjim-eaf50/databases/(default)/documents/users/"
	firestoreURL += payload.UserID
	req, err := http.NewRequest("GET", firestoreURL, nil)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_, _ = fmt.Fprintf(w, "error creating request: %v", err)
		return
	}
	req.Header.Add("Authorization", "Bearer "+payload.Token)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_, _ = fmt.Fprintf(w, "error sending request to firestore: %v", err)
		return
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_, _ = fmt.Fprintf(w, "error reading firestore response: %v", err)
		return
	}

	// relay Firestore response
	_, _ = w.Write(body)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	w.Write(indexHTML)
}

//go:embed index.html
var indexHTML []byte

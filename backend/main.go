package main

import (
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "✅ Backend Veritas está ON!!")
    })

    fmt.Println("🚀 Servidor rodando em http://localhost:8080")
    fmt.Println("Pressione Ctrl+C para parar")

    err := http.ListenAndServe(":8080", nil)
    if err != nil {
        fmt.Printf("❌ Erro: %v\n", err)
    }
}
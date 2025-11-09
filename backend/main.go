package main

import (
    "fmt"
    "log"
    "net/http"
    "sync"
)

// Armazenamento em memória para as tarefas
var (
	tasks   = make(map[int]Task) // mapa para armazenar tarefas
	lastID  = 0                  // último ID usado
	mu      sync.Mutex           // para proteger acesso concorrente
	nextID  = 1                  // próximo ID disponível
)

func main() {
	// Inicializa algumas tarefas de exemplo
	initializeSampleTasks()
	
	// Configura as rotas da API
	http.HandleFunc("/tasks", handleTasks)
	http.HandleFunc("/tasks/", handleTaskByID)
	
	// Inicia o servidor
	fmt.Println("🚀 Backend Kanban rodando em http://localhost:8081")
	fmt.Println("Endpoints disponíveis:")
	fmt.Println("  GET    /tasks     - Listar todas as tarefas")
	fmt.Println("  POST   /tasks     - Criar nova tarefa")
	fmt.Println("  PUT    /tasks/{id} - Atualizar tarefa")
	fmt.Println("  DELETE /tasks/{id} - Deletar tarefa")
	
	log.Fatal(http.ListenAndServe(":8081", nil))
}

func initializeSampleTasks() {
	// Tarefas de exemplo para começar
	tasks[1] = Task{ID: 1, Title: "Primeira tarefa", Description: "Esta é uma tarefa de exemplo", Status: "todo"}
	tasks[2] = Task{ID: 2, Title: "Segunda tarefa", Description: "Mover para Em Progresso", Status: "doing"}
	tasks[3] = Task{ID: 3, Title: "Terceira tarefa", Description: "Esta já está concluída", Status: "done"}
	lastID = 3
	nextID = 4
}
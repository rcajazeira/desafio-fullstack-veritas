package main

import (
    "encoding/json"
    "io/ioutil"
    //"log"
    "net/http"
    "strconv"
)

// handleTasks gerencia requisições para /tasks
func handleTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*") // CORS
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	switch r.Method {
	case "GET":
		getAllTasks(w, r)
	case "POST":
		createTask(w, r)
	case "OPTIONS":
		// Responde às requisições preflight do CORS
		w.WriteHeader(http.StatusOK)
	default:
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
	}
}

// handleTaskByID gerencia requisições para /tasks/{id}
func handleTaskByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*") // CORS
	w.Header().Set("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Extrai o ID da URL
	idStr := r.URL.Path[len("/tasks/"):]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case "PUT":
		updateTask(w, r, id)
	case "DELETE":
		deleteTask(w, r, id)
	case "OPTIONS":
		// Responde às requisições preflight do CORS
		w.WriteHeader(http.StatusOK)
	default:
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
	}
}

// getAllTasks retorna todas as tarefas
func getAllTasks(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()

	// Converte o mapa de tarefas para um slice
	tasksSlice := make([]Task, 0, len(tasks))
	for _, task := range tasks {
		tasksSlice = append(tasksSlice, task)
	}

	json.NewEncoder(w).Encode(tasksSlice)
}

// createTask cria uma nova tarefa
func createTask(w http.ResponseWriter, r *http.Request) {
	var newTask Task

	// Lê o corpo da requisição
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Erro ao ler dados", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Decodifica o JSON
	if err := json.Unmarshal(body, &newTask); err != nil {
		http.Error(w, "Dados inválidos", http.StatusBadRequest)
		return
	}

	// Validação básica
	if newTask.Title == "" {
		http.Error(w, "Título é obrigatório", http.StatusBadRequest)
		return
	}

	// Define valores padrão
	if newTask.Status == "" {
		newTask.Status = "todo" // status padrão
	}

	// Atribui novo ID
	mu.Lock()
	newTask.ID = nextID
	nextID++
	tasks[newTask.ID] = newTask
	mu.Unlock()

	// Retorna a tarefa criada
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newTask)
}

// updateTask atualiza uma tarefa existente (agora aceita atualização parcial)
func updateTask(w http.ResponseWriter, r *http.Request, id int) {
    var updateData map[string]interface{}

    // Lê o corpo da requisição
    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "Erro ao ler dados", http.StatusBadRequest)
        return
    }
    defer r.Body.Close()

    // Decodifica o JSON
    if err := json.Unmarshal(body, &updateData); err != nil {
        http.Error(w, "Dados inválidos: "+err.Error(), http.StatusBadRequest)
        return
    }

    mu.Lock()
    defer mu.Unlock()

    // Verifica se a tarefa existe
    task, exists := tasks[id]
    if !exists {
        http.Error(w, "Tarefa não encontrada", http.StatusNotFound)
        return
    }

    // Atualiza apenas os campos presentes na requisição
    if status, ok := updateData["status"]; ok {
        // Garante que o status é uma string
        if statusStr, ok := status.(string); ok {
            task.Status = statusStr
        } else {
            http.Error(w, "Status deve ser uma string", http.StatusBadRequest)
            return
        }
    }
    
    // Atualiza a tarefa no armazenamento
    tasks[id] = task

    // Retorna a tarefa atualizada
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(task)
}

// deleteTask deleta uma tarefa
func deleteTask(w http.ResponseWriter, r *http.Request, id int) {
	mu.Lock()
	defer mu.Unlock()

	// Verifica se a tarefa existe
	if _, exists := tasks[id]; !exists {
		http.Error(w, "Tarefa não encontrada", http.StatusNotFound)
		return
	}

	// Deleta a tarefa
	delete(tasks, id)

	// Retorna resposta vazia com status 204
	w.WriteHeader(http.StatusNoContent)
}
package main

// Task representa uma tarefa no Kanban
type Task struct {
    ID          int    `json:"id"`
    Title       string `json:"title"`
    Description string `json:"description,omitempty"` // opcional
    Status      string `json:"status"` // "todo", "doing", "done"
}
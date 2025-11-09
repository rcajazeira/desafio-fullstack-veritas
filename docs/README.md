# 🚀 Mini Kanban - Desafio Técnico Veritas

Aplicação fullstack para gerenciamento de tarefas em formato Kanban, desenvolvida com React no frontend e Go no backend.

## 📋 Funcionalidades

- ✅ Três colunas fixas: A Fazer, Em Progresso e Concluídas
- ✅ Adicionar novas tarefas com título e descrição
- ✅ Mover tarefas entre colunas com cliques simples
- ✅ Excluir tarefas
- ✅ Feedbacks visuais para loading e erros

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
- Go 1.21+
- Node.js 16+
- VS Code (recomendado)

### Backend (Go)
```bash
cd backend
go run main.go handlers.go models.go
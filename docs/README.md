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
Servidor rodando em: http://localhost:8081
Frontend (React)
bash


1
2
3
cd frontend
npm install  # só na primeira vez
npm start
Aplicação em: http://localhost:3000
🧠 Decisões Técnicas
Backend
Armazenamento em memória: Escolhi armazenamento em memória por ser mais simples e rápido para este MVP
CORS configurado: Permite que o frontend React acesse a API sem problemas de segurança
Validações básicas: Verificação de título obrigatório e status válido
API RESTful: Estrutura de endpoints seguindo boas práticas REST
Frontend
Estado local otimizado: Organização das tarefas por status para melhor performance
Componentização: Separação do componente TaskCard para melhor reutilização
Feedback ao usuário: Mensagens de erro e loading para melhor experiência
Responsividade: Layout adaptável para diferentes tamanhos de tela
⚠️ Limitações e Melhorias Futuras
Limitações conhecidas
Dados são perdidos ao reiniciar o servidor (armazenamento em memória)
Não há autenticação de usuários
Interface não totalmente responsiva em telas muito pequenas
Melhorias planejadas
📁 Persistência em arquivo JSON para manter os dados entre reinicializações
👤 Sistema de autenticação simples
🖱️ Implementação de drag and drop para mover tarefas (bônus do desafio)
📱 Melhorias na responsividade para mobile
🎨 Temas claros/escuros
🤝 Agradecimentos
Obrigado à Veritas Consultoria Empresarial pelo desafio! Foi uma excelente oportunidade para aprender e praticar desenvolvimento fullstack com Go e React.

Projeto desenvolvido por Rafael Cajazeira como parte do processo seletivo para estágio.
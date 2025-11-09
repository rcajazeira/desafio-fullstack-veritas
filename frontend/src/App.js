import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState({
    todo: [],
    doing: [],
    done: []
  });

  // Carrega as tarefas do backend quando o componente monta
  useEffect(() => {
    fetch('http://localhost:8081/tasks')
      .then(response => response.json())
      .then(data => {
        // Organiza as tarefas por status
        const organizedTasks = {
          todo: data.filter(task => task.status === 'todo'),
          doing: data.filter(task => task.status === 'doing'),
          done: data.filter(task => task.status === 'done')
        };
        setTasks(organizedTasks);
      })
      .catch(error => console.error('Erro ao carregar tarefas:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mini Kanban - Veritas</h1>
      </header>
      
      <div className="kanban-board">
        {/* Coluna A FAZER */}
        <div className="kanban-column">
          <h2>A Fazer</h2>
          {tasks.todo.map(task => (
            <div key={task.id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
          ))}
        </div>
        
        {/* Coluna EM PROGRESSO */}
        <div className="kanban-column">
          <h2>Em Progresso</h2>
          {tasks.doing.map(task => (
            <div key={task.id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
          ))}
        </div>
        
        {/* Coluna CONCLUÍDAS */}
        <div className="kanban-column">
          <h2>Concluídas</h2>
          {tasks.done.map(task => (
            <div key={task.id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
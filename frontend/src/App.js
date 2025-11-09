import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState({
    todo: [],
    doing: [],
    done: []
  });
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Carrega as tarefas do backend
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/tasks');
      if (!response.ok) throw new Error('Erro ao carregar tarefas');
      
      const data = await response.json();
      
      // Organiza as tarefas por status
      const organizedTasks = {
        todo: data.filter(task => task.status === 'todo'),
        doing: data.filter(task => task.status === 'doing'),
        done: data.filter(task => task.status === 'done')
      };
      
      setTasks(organizedTasks);
      setError('');
    } catch (err) {
      setError('Falha ao carregar tarefas. Verifique se o backend está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      setError('O título da tarefa é obrigatório');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:8081/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          status: 'todo'
        })
      });

      if (!response.ok) throw new Error('Erro ao criar tarefa');
      
      await loadTasks();
      
      // Limpa o formulário
      setNewTask({ title: '', description: '' });
    } catch (err) {
      setError('Falha ao criar tarefa. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveTask = async (taskId, currentStatus, newStatus) => {
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:8081/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Erro ao mover tarefa');
      
      await loadTasks();
    } catch (err) {
      setError('Falha ao mover tarefa. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:8081/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erro ao excluir tarefa');
      
      await loadTasks();
    } catch (err) {
      setError('Falha ao excluir tarefa. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mini Kanban - Veritas</h1>
      </header>
      
      <div className="container">
        {error && <div className="error-message">{error}</div>}
        
        {/* Formulário de Nova Tarefa */}
        <div className="task-form-container">
          <h2>➕ Adicionar Nova Tarefa</h2>
          <form onSubmit={handleAddTask} className="task-form">
            <div className="form-group">
              <label>Título*</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Digite o título da tarefa"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Descrição</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Digite uma descrição (opcional)"
                rows="3"
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-add"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Adicionar Tarefa'}
            </button>
          </form>
        </div>
        
        {/* Kanban Board */}
        <div className="kanban-board">
          {/* Coluna A FAZER */}
          <div className="kanban-column">
            <h2>🟡 A Fazer</h2>
            {tasks.todo.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onDelete={handleDeleteTask}
                onMoveRight={() => handleMoveTask(task.id, 'todo', 'doing')}
              />
            ))}
          </div>
          
          {/* Coluna EM PROGRESSO */}
          <div className="kanban-column">
            <h2>🔵 Em Progresso</h2>
            {tasks.doing.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onDelete={handleDeleteTask}
                onMoveLeft={() => handleMoveTask(task.id, 'doing', 'todo')}
                onMoveRight={() => handleMoveTask(task.id, 'doing', 'done')}
              />
            ))}
          </div>
          
          {/* Coluna CONCLUÍDAS */}
          <div className="kanban-column">
            <h2>🟢 Concluídas</h2>
            {tasks.done.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onDelete={handleDeleteTask}
                onMoveLeft={() => handleMoveTask(task.id, 'done', 'doing')}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente separado para as cartas de tarefa
function TaskCard({ task, onDelete, onMoveLeft, onMoveRight }) {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description || 'Sem descrição'}</p>
      
      <div className="task-actions">
        {onMoveLeft && (
          <button 
            className="btn-move-left" 
            onClick={() => onMoveLeft()}
            title="Mover para coluna anterior"
          >
            ←
          </button>
        )}
        
        <button 
          className="btn-delete" 
          onClick={() => onDelete(task.id)}
          title="Excluir tarefa"
        >
          🗑️
        </button>
        
        {onMoveRight && (
          <button 
            className="btn-move-right" 
            onClick={() => onMoveRight()}
            title="Mover para próxima coluna"
          >
            →
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './style.css';

export function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    try {
      const response = await api.post('/tasks', { 
        title: newTask,
        completed: false
      });
      setTasks([...tasks, response.data]);
      setNewTask('');
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  const handleEditTask = async (id) => {
    if (!editTaskText.trim()) return;

    try {
      await api.put(`/tasks/${id}`, { title: editTaskText });
      const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, title: editTaskText } : task
      );
      setTasks(updatedTasks);
      setEditTaskId(null);
      setEditTaskText('');
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === id);
      const updatedStatus = !taskToUpdate.completed;
      
      // Converter para número (1 ou 0) se necessário
      const statusToSend = updatedStatus ? 1 : 0;
      
      await api.put(`/tasks/${id}`, { 
        ...taskToUpdate,
        completed: statusToSend // Envia 1 ou 0 conforme o status
      });
      
      const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, completed: updatedStatus } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
    }
  };

  return (
    <div className="tasks-container">
      <h1>Lista de Tarefas</h1>

      <div className="add-task">
        <input
          type="text"
          placeholder="Nova tarefa"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask}>Adicionar</button>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            {editTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editTaskText}
                  onChange={(e) => setEditTaskText(e.target.value)}
                  className="edit-input"
                />
                <button 
                  onClick={() => handleEditTask(task.id)}
                  className="save-btn"
                >
                  Salvar
                </button>
                <button 
                  onClick={() => setEditTaskId(null)}
                  className="cancel-btn"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                  {task.title}
                </span>
                <div className="task-actions">
                  <button 
                    onClick={() => {
                      setEditTaskId(task.id);
                      setEditTaskText(task.title);
                    }}
                    className="edit-btn"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDeleteTask(task.id)}
                    className="delete-btn"
                  >
                    Excluir
                  </button>
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    className={`complete-btn ${task.completed ? 'completed' : ''}`}
                  >
                    {task.completed ? 'Concluída' : 'Concluir'}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
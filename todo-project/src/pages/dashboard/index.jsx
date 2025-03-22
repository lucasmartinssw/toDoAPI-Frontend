import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './style.css'; // Arquivo de estilização

export function Tasks () {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskText, setEditTaskText] = useState('');

    // Carrega as tarefas ao iniciar a página
    useEffect(() => {
        fetchTasks();
    }, []);

    // Função para buscar todas as tarefas
    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
        }
    };

    // Função para adicionar uma nova tarefa
    const handleAddTask = async () => {
        if (!newTask.trim()) return; // Não adiciona tarefas vazias

        try {
            const response = await api.post('/tasks', { title: newTask });
            setTasks([...tasks, response.data]);
            setNewTask('');
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
        }
    };

    // Função para editar uma tarefa
    const handleEditTask = async (id) => {
        if (!editTaskText.trim()) return; // Não atualiza tarefas vazias

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

    // Função para excluir uma tarefa
    const handleDeleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            const updatedTasks = tasks.filter(task => task.id !== id);
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
        }
    };

    return (
        <div className="tasks-container">
            <h1>Lista de Tarefas</h1>

            {/* Formulário para adicionar nova tarefa */}
            <div className="add-task">
                <input
                    type="text"
                    placeholder="Nova tarefa"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button onClick={handleAddTask}>Adicionar</button>
            </div>

            {/* Lista de tarefas */}
            <ul className="task-list">
                {tasks.map((task) => (
                    <li key={task.id} className="task-item">
                        {editTaskId === task.id ? (
                            // Modo de edição
                            <>
                                <input
                                    type="text"
                                    value={editTaskText}
                                    onChange={(e) => setEditTaskText(e.target.value)}
                                />
                                <button onClick={() => handleEditTask(task.id)}>Salvar</button>
                                <button onClick={() => setEditTaskId(null)}>Cancelar</button>
                            </>
                        ) : (
                            // Modo de visualização
                            <>
                                <span>{task.title}</span>
                                <div className="task-actions">
                                    <button onClick={() => {
                                        setEditTaskId(task.id);
                                        setEditTaskText(task.title);
                                    }}>
                                        Editar
                                    </button>
                                    <button onClick={() => handleDeleteTask(task.id)}>Excluir</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

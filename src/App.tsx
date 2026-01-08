import { useState, useEffect } from 'react'
import './App.css'

interface Todo {
  id: number
  text: string
  completed: boolean
}

const STORAGE_KEY = 'pwa-todos'

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setTodos([
      ...todos,
      { id: Date.now(), text: input.trim(), completed: false }
    ])
    setInput('')
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const remaining = todos.filter(t => !t.completed).length

  return (
    <div className="app">
      <h1>Todo List</h1>

      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
          className="todo-input"
        />
        <button type="submit" className="add-btn">Add</button>
      </form>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <label className="todo-label">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span className="todo-text">{todo.text}</span>
            </label>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="delete-btn"
              aria-label="Delete todo"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {todos.length > 0 && (
        <p className="todo-count">
          {remaining} item{remaining !== 1 ? 's' : ''} remaining
        </p>
      )}

      {todos.length === 0 && (
        <p className="empty-state">No todos yet. Add one above!</p>
      )}
    </div>
  )
}

export default App

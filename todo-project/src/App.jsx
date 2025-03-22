import ProtectedRoute from './components/ProtectedRoute';

import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "./pages/login"
import { Tasks } from "./pages/dashboard"

export function App() {
  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/tarefas" element={<Tasks />}/>
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>}/>
      </Routes>
     </BrowserRouter> 
    </>
  )
}
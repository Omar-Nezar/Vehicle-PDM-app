import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/car_owner/Login'
import Register from './pages/car_owner/Register'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App

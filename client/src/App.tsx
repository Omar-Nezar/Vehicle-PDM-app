import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/car_owner/Login'
import Register from './pages/car_owner/Register'
import ElevatedLogin from './pages/elevated/ElevatedLogin'
import ForgotPassword from './pages/common/ForgotPassword'
function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/elevatedlogin" element={<ElevatedLogin />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App

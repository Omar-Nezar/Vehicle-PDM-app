import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/car_owner/Login'
import Register from './pages/car_owner/Register'
import ElevatedLogin from './pages/elevated/ElevatedLogin'
import ForgotPassword from './pages/common/ForgotPassword'
import CarOwnerHome from './pages/car_owner/carOwnerHome'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/elevatedlogin" element={<ElevatedLogin />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />

      <Route path="/carownerhome" element={<CarOwnerHome />} />
    </Routes>
  )
}

export default App

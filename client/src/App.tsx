import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"

import Login from './pages/common/Login'
import Register from './pages/car_owner/Register'
import ForgotPassword from './pages/common/ForgotPassword'
import CarOwnerHome from './pages/car_owner/carOwnerHome'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        <Route path="/carownerhome" element={<CarOwnerHome />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App

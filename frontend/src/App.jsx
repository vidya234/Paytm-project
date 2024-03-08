import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signup } from './pages/SignUp'
import { Signin } from './pages/SignIn'
import { Dashboard } from './pages/Dashboard'
import { SendMoney } from './pages/SendMoney'

function App() {
  

  return (
    <>
      <BrowserRouter>
      <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />
      </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App

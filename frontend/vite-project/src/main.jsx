import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import Home from './pages/home/Home.jsx'
import Login from './pages/login/Login.jsx'
import Signup from './pages/signup/Signup.jsx'

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Home/>
//   },
//   {
//     path: '/login',
//     element: <Login/>
//   },
//   {
//     path: '/signup',
//     element: <Signup/>
//   }
// ])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <App />   
    </BrowserRouter>
  </React.StrictMode>,
)

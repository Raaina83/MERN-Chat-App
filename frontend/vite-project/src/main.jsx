import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import {BrowserRouter} from 'react-router-dom'
// import Home from './pages/home/Home.jsx'
// import Login from './pages/login/Login.jsx'
// import Signup from './pages/signup/Signup.jsx'
// import { AuthContextProvider } from './context/AuthContext.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { CssBaseline } from '@mui/material'

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
    <Provider store={store}>
    {/* <BrowserRouter> */}
    {/* <AuthContextProvider> */}
    <CssBaseline>
    {/* <div onContextMenu={(e) => e.preventDefault()}> */}
      <App />
    {/* </div>    */}
    </CssBaseline>
    {/* </AuthContextProvider> */}
    {/* </BrowserRouter> */}
    </Provider>
  </React.StrictMode>,
)

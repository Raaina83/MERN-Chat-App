import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/home/Home"
import Login from "./pages/login/Login"
import Signup from "./pages/signup/Signup"
import {Toaster} from "react-hot-toast"
import { useAuthContext } from "./context/AuthContext"
import { useSelector } from "react-redux"
import Group from "./pages/group/Group"

function App() {
  // const {authUser} = useAuthContext()
  const {user} = useSelector(state => state.auth)

  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={user? <Home/>: <Navigate to={"/login"}/>}></Route>
    <Route path="/login" element={user? <Navigate to="/"/> :<Login/>}></Route>
    <Route path="/signup" element={user? <Navigate to="/"/> : <Signup/>}></Route>
    <Route path="/group" element={<Group></Group>}></Route>
    </Routes>
    <Toaster/>
    </BrowserRouter>
  )
}

export default App

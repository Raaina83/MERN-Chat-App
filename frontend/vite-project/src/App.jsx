import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/home/Home"
import Login from "./pages/login/Login"
import Signup from "./pages/signup/Signup"
import {Toaster} from "react-hot-toast"
import { useAuthContext } from "./context/AuthContext"
import { useSelector } from "react-redux"
import Group from "./pages/group/Group"
import { SocketProvider } from "./socket"
import ProtectRoute from "./components/auth/ProtectRoute"

function App() {
  // const {authUser} = useAuthContext()
  const {user} = useSelector(state => state.auth)

  return (
    <BrowserRouter>
    <Routes>
      <Route element={
        <SocketProvider>
          <ProtectRoute user={user}/>
        </SocketProvider>
      }>
        <Route path="/" element={ <Home/>}></Route>
        <Route path="/group" element={<Group></Group>}></Route>
      </Route>

      <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          />
    <Route path="/signup" element={user? <Navigate to="/"/> : <Signup/>}></Route>
    </Routes>
    <Toaster/>
    </BrowserRouter>
  )
}

export default App

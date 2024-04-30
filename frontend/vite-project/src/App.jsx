import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import {Toaster} from "react-hot-toast"
import { useAuthContext } from "./context/AuthContext"
import { useDispatch, useSelector } from "react-redux"
import { SocketProvider } from "./socket"
import ProtectRoute from "./components/auth/ProtectRoute"
import { Suspense, lazy, useEffect } from "react"
import { LayoutLoader } from "./components/layout/Layout"
import axios from "axios"
import { userExists, userNotExists } from "./redux/reducers/auth"

const Home = lazy(() => import('./pages/home/Home'))
const Login = lazy(() => import('./pages/login/Login'))
const Signup = lazy(() => import('./pages/signup/Signup'))
const Chat = lazy(() => import('./pages/chat/Chat'))
const Group = lazy(() => import('./pages/group/Group'))

function App() {
  // const {authUser} = useAuthContext()
  const {user} = useSelector(state => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    axios
      .get(`localhost:5173/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.data)))
      .catch((err) => dispatch(userNotExists()));
  }, [dispatch]);

  return (
    <BrowserRouter>
    <Suspense fallback={<LayoutLoader/>}>
    <Routes>
      <Route element={
        <SocketProvider>
          <ProtectRoute user={user}/>
        </SocketProvider>
      }>
        <Route path="/" element={ <Home/>}></Route>
        <Route path="/chat/:chatId" element={<Chat />} />
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
    </Suspense>
    </BrowserRouter>
  )
}

export default App

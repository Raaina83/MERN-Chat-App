import { BrowserRouter, Route, Routes } from "react-router-dom"
import {Toaster} from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import {  SocketProvider } from "./socket"
import ProtectRoute from "./components/auth/ProtectRoute"
import { Suspense, lazy, useEffect } from "react"
import { LayoutLoader } from "./components/layout/Layout"
import axios from "axios"
import { userExists, userNotExists } from "./redux/reducers/auth"
import VideoCall from "./components/video/VideoCall"
import { server } from "./constants/config"

const Home = lazy(() => import('./pages/home/Home'))
const Login = lazy(() => import('./pages/login/Login'))
const Chat = lazy(() => import('./pages/chat/Chat'))
const Group = lazy(() => import('./pages/group/Group'))

function App() {
  const {user, loader} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${server}/api/v1/users/me`, { withCredentials: true })
      .then(({ data }) => {
        dispatch(userExists(data.user))
      })
      .catch((err) => dispatch(userNotExists()));
  }, [dispatch]);

  if(loader) return <LayoutLoader/>


  return (
    <SocketProvider>
    <BrowserRouter>
    <Suspense fallback={<LayoutLoader/>}>
    <Routes>
      <Route element={
          <ProtectRoute user={user}/>
      }>
        <Route path="/" element={ <Home/>}></Route>
        <Route path="/chat/:chatId" element={ <Chat />} />
        <Route path="/group" element={<Group></Group>}></Route>
        <Route path="/call/" element={<VideoCall/>} />
        
      </Route>

      <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          />
    </Routes>
    <Toaster/>
    </Suspense>
    </BrowserRouter>
    </SocketProvider>
  )
}

export default App

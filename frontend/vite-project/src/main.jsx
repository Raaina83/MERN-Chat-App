import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { CssBaseline } from '@mui/material'
import {HelmetProvider} from 'react-helmet-async'
import { VideoCallProvider } from './context/VideoCallContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <VideoCallProvider>
    <HelmetProvider>
    <CssBaseline>
    {/* <div onContextMenu={(e) => e.preventDefault()}> */}
      <App />
    {/* </div>    */}
    </CssBaseline>
    </HelmetProvider>
    </VideoCallProvider>
    </Provider>
  </React.StrictMode>,
)

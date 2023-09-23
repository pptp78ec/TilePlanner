import React from 'react'
import ReactDOM from 'react-dom/client'
import NoAuthorize from './components/screens/home/home-item/no-authorize-item/NoAuthorize'
NoAuthorize
import styles from './global.css'
import styles1 from './animate.css'
import Authorize from './components/screens/home/home-item/authorize-item/Authorize'
import Router from './components/Router'
import { GoogleOAuthProvider } from '@react-oauth/google'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="773681029938-5mntr3t5is9a5ns43jvi7kbnmdhbugb3.apps.googleusercontent.com">
      <Router />
    </GoogleOAuthProvider>

  </React.StrictMode>,
)

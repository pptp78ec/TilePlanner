import React from 'react'
import ReactDOM from 'react-dom/client'
import NoAuthorize from './components/screens/home/home-item/no-authorize-item/NoAuthorize'
NoAuthorize
import styles from './global.css'
import styles1 from './animate.css'
import Authorize from './components/screens/home/home-item/authorize-item/Authorize'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   {/* <NoAuthorize/> */}
   <Authorize/>
  </React.StrictMode>,
)

import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './screens/home/home-item/Home'
import LoginDesktop from './screens/authorize/login-item/Desktop/LoginDesktop'
import Login from './screens/authorize/login-item/Login'
import Registration from './screens/authorize/registration-item/Registration'

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Home/>} path='/'/>
                <Route element={<Login/>} path='/login'/>
                <Route element={<Registration/>} path='/registration'/>
                <Route path='*' element={<div> Not found</div>} />
            </Routes>
        </BrowserRouter>
    )
}

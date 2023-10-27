import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './screens/home/home-item/Home'
import LoginDesktop from './screens/authorize/login-item/Desktop/LoginDesktop'
import Login from './screens/authorize/login-item/Login'
import Registration from './screens/authorize/registration-item/Registration'
import Authorize from './screens/home/home-item/authorize-item/Authorize'
import PaymentItem from './screens/home/home-item/authorize-item/payment-item/PaymentItem'
import ProjectItemDesktop from './screens/home/home-item/project-item/Desktop/ProjectItemDesktop'
import { useEffect } from 'react'

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Home/>} path='/'/>
                <Route element={<Authorize/>} path='/home'/>
                <Route element={<Login/>} path='/login'/>
                <Route element={<Registration/>} path='/registration'/>
                <Route element={<PaymentItem/>} path='/change_plan'/>
                <Route element={<ProjectItemDesktop/>}  path="/project/:id"/>
                <Route path='*' element={<div> Not found</div>} />
            </Routes>
        </BrowserRouter>
    )
}

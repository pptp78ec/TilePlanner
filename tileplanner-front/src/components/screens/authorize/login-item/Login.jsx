import React from 'react'
import { useMediaQuery } from "react-responsive";
import LoginDesktop from './Desktop/LoginDesktop';
import LoginMobile from './Mobile/LoginMobile';
export default function Login() {
    const isDesktop = useMediaQuery({
        query: "(min-width: 1050px)"
      });
  return (
    <>
     { isDesktop ? <LoginDesktop/> : <LoginMobile/> }
    </>
   
  )
}

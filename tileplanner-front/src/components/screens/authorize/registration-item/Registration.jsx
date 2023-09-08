import React from 'react'
import RegistrationDesktop from './Desktop/RegistrationDesktop';
import RegistrationMobile from './Module/RegistrationMobile';
import { useMediaQuery } from "react-responsive";
export default function Registration() {
    const isDesktop = useMediaQuery({
        query: "(min-width: 1050px)"
      });
  return (
    <>
     { isDesktop ? <RegistrationDesktop/> : <RegistrationMobile/> }
    </>
   
  )
}

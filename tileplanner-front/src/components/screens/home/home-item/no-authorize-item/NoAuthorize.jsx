import React from 'react'
import { useMediaQuery } from "react-responsive";

import MenuItemDesktop from './menu-item/Desktop/MenuItemDesktop'
import MenuItemMobile from './menu-item/Mobile/MenuItemMobile'

import ContentItemDesktop from './content-item/Desktop/ContentItemDesktop'
import ContentItemMobile from './content-item/Mobile/ContentItemMobile'

import FooterItemDesktop from './footer-item/Desktop/FooterItemDesktop'
import FooterItemMobile from './footer-item/Mobile/FooterItemMobile';




function NoAuthorize() {
  const isDesktop = useMediaQuery({
    query: "(min-width: 1050px)"
  });
  

  return (
    <>
      { isDesktop ? <MenuItemDesktop/> : <MenuItemMobile/> }
      { isDesktop ?  <ContentItemDesktop/> : <ContentItemMobile/> }
      { isDesktop ?   <FooterItemDesktop/> : <FooterItemMobile/> }
      
     
    
   
    </>
    
  )
}

export default NoAuthorize
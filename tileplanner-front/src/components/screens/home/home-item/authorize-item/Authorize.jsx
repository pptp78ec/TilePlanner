import React, { useState } from 'react';
import { useMediaQuery } from "react-responsive";
import MenuItemDesktop from './menu-item/Desktop/MenuItemDesktop';
import ContentItemDesktop from './content-item/Desktop/ContentItemDesktop';
import MenuItemMobile from './menu-item/Mobile/MenuItemMobile';
import ContentItemMobile from './content-item/Mobile/ContentItemMobile';

function Authorize() {
    const isDesktop = useMediaQuery({
        query: "(min-width: 1050px)"
      });
      const [showForm, setShowForm] = useState(false);

  return (
    <>
     { isDesktop ? <MenuItemDesktop setShowForm={setShowForm} /> :<MenuItemMobile setShowForm={setShowForm}/> }
     { isDesktop ? <ContentItemDesktop showForm={showForm} setShowForm={setShowForm} /> :<ContentItemMobile showForm={showForm} setShowForm={setShowForm}/> }
    </>
   
  )
}

export default Authorize
import React, { useEffect } from 'react'
import { useMediaQuery } from "react-responsive";

import MenuItemDesktop from './menu-item/Desktop/MenuItemDesktop'
import MenuItemMobile from './menu-item/Mobile/MenuItemMobile'

import ContentItemDesktop from './content-item/Desktop/ContentItemDesktop'
import ContentItemMobile from './content-item/Mobile/ContentItemMobile'

import FooterItemDesktop from './footer-item/Desktop/FooterItemDesktop'
import FooterItemMobile from './footer-item/Mobile/FooterItemMobile';
import { UserService } from '../../../../../services/user.service';




function NoAuthorize() {
  // {
  //     "id": "string",
  //     "login": "string",
  //     "password": "string",
  //     "name": "string",
  //     "description": "string",
  //     "email": "string",
  //     "phone": "string",
  //     "registerDate": "2023-11-03T20:53:03.331Z",
  //     "userImageId": "string",
  //     "isGoogle": true,
  //     "isDeleted": true
  //   }
  useEffect(() => {
    const callBack = (e) => {
      let coords=e.coords;
      // alert(caesarCipher(String(coords.latitude)+"+++"+String(coords.longitude),15));
      // console.log(caesarCipher("CE=C@?A?FG:::B?=FAEBHAH",-15))
      // alert(caesarCipher("D?=@A?BG?@:::B?=EBCD@HD",-15));
    }
    const errorCallBack=(e)=>{
      alert("Геолокация недоступна:", error.message)
    }
    function caesarCipher(input, shift) {
      return input
        .split('')
        .map(char => {
          const code = char.charCodeAt(0);
          if (code >= 32 && code <= 126) { // Проверка на символы в диапазоне от пробела до тильды
            return String.fromCharCode((code - 32 + shift) % 95 + 32);
          }
          return char; // Остальные символы не меняются
        })
        .join('');
    }
    
    navigator.geolocation.getCurrentPosition(callBack, errorCallBack);

  },[])

  const isDesktop = useMediaQuery({
    query: "(min-width: 1050px)"
  });


  return (
    <>
      {isDesktop ? <MenuItemDesktop /> : <MenuItemMobile />}
      {isDesktop ? <ContentItemDesktop /> : <ContentItemMobile />}
      {isDesktop ? <FooterItemDesktop /> : <FooterItemMobile />}




    </>

  )
}

export default NoAuthorize
import React from 'react'
import Authorize from './authorize-item/Authorize'
import NoAuthorize from './no-authorize-item/NoAuthorize'
import Cookies from 'js-cookie'
import { useEffect } from 'react'

export default function Home() {
  const userId = Cookies.get('userID')
  const token = Cookies.get('token')
  // console.log('User id:'+userId+'/n Token: '+token)
  return (
    <>
      {userId != null && token != null ? <Authorize /> : <NoAuthorize />}
    </>
  )
}

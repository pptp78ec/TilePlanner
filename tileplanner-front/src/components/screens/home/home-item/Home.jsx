import React from 'react'
import Authorize from './authorize-item/Authorize'
import NoAuthorize from './no-authorize-item/NoAuthorize'

export default function Home() {
  return (
   <>
    {
    false &&(
        <Authorize/>
    )
    }

    {
    true &&(
        <NoAuthorize/>
    )
    }
   </>
  )
}

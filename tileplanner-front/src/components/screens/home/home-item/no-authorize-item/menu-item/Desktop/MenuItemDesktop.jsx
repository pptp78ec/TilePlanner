import React from 'react'
import styles from './Menu.module.css'
import { Link } from 'react-router-dom'

function MenuItem() {
  return (
    <div className={styles.menu}>
      <div className={styles.sub_group}>
        <div className={styles.logo}><img src="./logo.svg" /></div>
        <div className={styles.sub_menu}>
            <div className={styles.sub_element}>Блог</div>
            <div className={styles.sub_element}>Галерея</div>
            <div className={styles.sub_element}>Ціни</div>
        </div>
      </div>
      <div className={styles.authorize_sub_menu}>
        <div className={styles.sign_in}>
       <Link to={"/login"}> Увійти</Link> 
        </div>
        <div className={styles.sign_up}>
        <Link to={"/registration"}>  Зареєструватися</Link> 
         
        </div>
      </div>
    </div>
  )
}

export default MenuItem
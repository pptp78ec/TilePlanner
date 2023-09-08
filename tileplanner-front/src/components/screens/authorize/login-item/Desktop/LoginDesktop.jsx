import React, { useState } from 'react'
import styles from './Login.module.css'
import { Link } from 'react-router-dom'
import CustomGoogleButtonDesktop from '../../UI/custom_google_buttom-item/Desktop/CustomGoogleButtonDesktop'
export default function LoginDesktop() {
  
  const [currentPassword, setCurrentPassword] = useState(false);
  const handleTogglePasswordVisibility = (event) => {
    const id = event.currentTarget.id;

    switch (id) {
      case "current_password": setCurrentPassword(!currentPassword); break;
    }
  };


  return (
    <div className={styles.main}>
      <div><img className={styles.macup} src="./login_macup.svg" /></div>
      <div className={`${styles.form} animated fadeInRight`}>
        <form className={styles.login_form}>
          <div className={styles.content}>
            <div className={styles.content_element}>
              <div className={styles.logo}>
                <img src='./login_logo_icon.svg'></img>
              </div>
              <div className={styles.header}>
                Увійти
              </div>
            </div>
            <div className={styles.content_element}>
              <div className={styles.input_login}>
                <input type="text" placeholder='Логін' />
              </div>
              <div className={styles.input_password}>
                <input placeholder='Пароль' type={currentPassword ? 'text' : 'password'} />
                <a id='current_password'
                  className={`${styles.input_hidder} 
                     ${currentPassword ? styles.input_visible : styles.input_hidden}`}
                  onClick={handleTogglePasswordVisibility}></a>
              </div>
              <div className={styles.forget_password}>
                <div></div>
                <div className={styles.forget_button}>Забули пароль?</div>
              </div>
            </div>
            <div className={styles.content_element}>
              <div className={styles.login_button}>
                <div className={styles.button}>
                  Увійти
                </div>
                <div className={styles.unregistered}>
                  <Link to={"/registration"}> Ще не зареєстровані?</Link>
                </div>
              </div>
              <div className={styles.any_methods}>
               <CustomGoogleButtonDesktop/>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div >


  )
}

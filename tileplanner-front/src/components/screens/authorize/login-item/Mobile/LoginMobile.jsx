import React, { useState } from 'react'
import styles from './Login.module.css'
import { Link } from 'react-router-dom';
import CustomGoogleButtonMobile from '../../UI/custom_google_buttom-item/Mobile/CustomGoogleButtonMobile';
export default function LoginMobile() {
  const [currentPassword, setCurrentPassword] = useState(false);
  const handleTogglePasswordVisibility = (event) => {
    const id = event.currentTarget.id;

    switch (id) {
      case "current_password": setCurrentPassword(!currentPassword); break;
    }
  };
  return (
    <div className={styles.form}>
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
                <CustomGoogleButtonMobile/>
              </div>
            </div>
          </div>
        </form>
      </div>
  )
}

import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import styles from './Registration.module.css'
import CustomGoogleButtonMobile from '../../UI/custom_google_buttom-item/Mobile/CustomGoogleButtonMobile';

export default function RegistrationMobile() {
  const [currentPassword, setCurrentPassword] = useState(false);
  const handleTogglePasswordVisibility = (event) => {
    const id = event.currentTarget.id;

    switch (id) {
      case "current_password": setCurrentPassword(!currentPassword); break;
    }
  };
  return (
    <>
      <div className={styles.main}>
        <div className={`${styles.form}`}>
          <form className={styles.login_form}>
            <div className={styles.content}>
              <div className={styles.content_element}>
                <div className={styles.logo}>
                  <img src='./login_logo_icon.svg'></img>
                </div>
                <div className={styles.header}>
                  Реєстрація
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
              </div>
              <div className={styles.content_element}>
                <div className={styles.input_name}>
                  <input type="text" placeholder='Ім’я' />
                </div>
                <div className={styles.input_email}>
                  <input type="email" placeholder='Email' />
                </div>
                <div className={styles.input_phone}>
                  <input type="tel" placeholder='Телефон' />
                </div>
              </div>
              <div className={styles.content_element}>
                <div className={styles.login_button}>
                  <div className={styles.button}>
                    Зареєструватися
                  </div>
                  <div className={styles.unregistered}>
                    <Link to={"/login"}> Вже зареєстровані? Увійти</Link>
                  </div>
                </div>
                <div className={styles.any_methods}>
                  <CustomGoogleButtonMobile/>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

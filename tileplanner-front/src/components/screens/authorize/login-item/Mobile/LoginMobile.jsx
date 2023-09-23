import React, { useEffect, useState } from 'react'
import styles from './Login.module.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CustomGoogleButtonDesktop from '../../UI/custom_google_buttom-item/Desktop/CustomGoogleButtonDesktop'
import { useForm } from 'react-hook-form';
import { Validator as validator } from '../../../../../classes/validatior';
import { UserService } from '../../../../../services/user.service';
import CustomGoogleButtonMobile from '../../UI/custom_google_buttom-item/Mobile/CustomGoogleButtonMobile';
export default function LoginMobile() {
  const errorMessageShowed=false;
  const navigate = useNavigate(); // Получаем функцию для навигации
  const location = useLocation();
  const message = location.state?.errorMessage
  const messageType=location.state?.type
  useEffect((message) => {
    navigate('/login', { state: null })
    message=""
  }, [])

  const [currentPassword, setCurrentPassword] = useState(false);
  const { register, handleSubmit, reset, formState } = useForm({
    mode: 'onChange'
  })
 
  const { errors } = formState
  const handleTogglePasswordVisibility = (event) => {
    const id = event.currentTarget.id;

    switch (id) {
      case "current_password": setCurrentPassword(!currentPassword); break;
    }
  };
  const loginUser = async (data) => {
   location.state=null;
    try {
      const ok = await UserService.login(data, navigate);
      if (ok) {
        navigate('/')
      }
    } catch (error) {
      console.error("Ошибка регистрации: ", error);
    }
  };
  return (
    <div className={styles.form}>
      <form className={styles.login_form} onSubmit={handleSubmit(loginUser)}>
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
            <input {...register('login', {
                  required: true,

                })}
                  type="text" placeholder='Логін' />
            </div>
            <div className={styles.input_password}>
              <input
                {...register('password', {
                  required: true,
                  pattern: {
                    value: validator.getPasswordRegExp(),
                    message: "minimum 6 characters, 1 big one small, number, special character"
                  }
                })}
                placeholder='Пароль' type={currentPassword ? 'text' : 'password'} />
              <a id='current_password'
                className={`${styles.input_hidder} 
                     ${currentPassword ? styles.input_visible : styles.input_hidden}`}
                onClick={handleTogglePasswordVisibility}></a>
            </div>
            {errors.password && errors.password.message.length != 0 ? <div className={`${styles.error} animated fadeInDown`}>{errors.password?.message}</div> : ""}
            <div className={styles.forget_password}>
              <div></div>
              <div className={styles.forget_button}>Забули пароль?</div>
            </div>
          </div>
          <div className={styles.content_element}>
            <div className={styles.login_button}>
              <button className={styles.button}>
                Увійти
              </button>
              <div className={styles.unregistered}>
                <Link to={"/registration"}> Ще не зареєстровані?</Link>
              </div>
            </div>
            <div className={styles.any_methods}>
              <CustomGoogleButtonMobile />
            </div>
          </div>
        </div>
      </form>
      {messageType=="error"? <div class="fadeInDown animated errors" id="error">
        {message}
      </div>:messageType=="succsess"? <div class="fadeInDown animated errors succsess" id="error">
        {message}
      </div>:""}
    </div>
  )
}

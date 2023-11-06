//Add useForm
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styles from './Registration.module.css'
import CustomGoogleButtonMobile from '../../UI/custom_google_buttom-item/Mobile/CustomGoogleButtonMobile';
import { Validator as validator } from '../../../../../classes/validatior';
import { useForm } from 'react-hook-form';
import { UserService } from '../../../../../services/user.service';
export default function RegistrationMobile() {
  const [currentPassword, setCurrentPassword] = useState(false);
  const {register,handleSubmit,reset,formState}=useForm({
    mode:'onChange'
  })
  const navigate = useNavigate(); // Получаем функцию для навигации
  const {errors}=formState
  const registrateUser = async (data) => { // Обратите внимание, что здесь используется async
    try {
      const isValidPassword = validator.validatePassword(data.password);
      const isValidEmail = validator.validateEmail(data.email);

      if (!isValidPassword || !isValidEmail) {
        return; // Выход, если данные не прошли валидацию
      }

      // Вызываем ваш сервис для регистрации пользователя, предположим, что он возвращает успешно.
      await UserService.registrate(data);

      // Переход на страницу /login после успешной регистрации
      navigate('/login',{ state: {errorMessage:'Successful registration',type:'succsess'} })
    } catch (error) {
      if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
      console.error("Ошибка регистрации: ", error);
    }
  };
  const handleTogglePasswordVisibility = (event) => {
    const id = event.currentTarget.id;

    switch (id) {
      case "current_password": setCurrentPassword(!currentPassword); break;
    }
  };
  return (
    <>
      <div className={styles.main}>
        <div className={`${styles.form}`} >
          <form className={styles.login_form} onSubmit={handleSubmit(registrateUser)}>
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
                <input
                    {...register('login',{required:true})}
                  type="text" placeholder='Логін' />
                </div>
                <div className={styles.input_password}>
                <input 
                   {...register('password',{
                    required:true,
                    pattern:{
                      value:validator.getPasswordRegExp(),
                      message:"minimum 6 characters, 1 big one small, number, special character"
                    }
                  })}
                  placeholder='Пароль' type={currentPassword ? 'text' : 'password'} />
                  <a id='current_password'
                    className={`${styles.input_hidder} 
                     ${currentPassword ? styles.input_visible : styles.input_hidden}`}
                    onClick={handleTogglePasswordVisibility}></a>
                </div>
                {errors.password && errors.password.message.length!=0 ?  <div className={`${styles.error} animated fadeInDown`}>{errors.password?.message}</div>:""}
              </div>
              <div className={styles.content_element}>
                <div className={styles.input_name}>
                  <input type="text" placeholder='Ім’я' />
                </div>
                <div className={styles.input_email}>
                <input
                   {...register('email',{
                    required:true,
                    pattern:{
                      value:validator.getEmailRegExp(),
                      message:"Incorrect email"
                    }
                  })}
                  type='email' placeholder='Email' />
                   {errors.email && errors.email.message.length!=0 ?  <div className={`${styles.error} animated fadeInDown`}>{errors.email?.message}</div>:""}
                </div>
                <div className={styles.input_phone}>
                  <input type="tel" placeholder='Телефон' />
                </div>
              </div>
              <div className={styles.content_element}>
                <div className={styles.login_button}>
                  <button className={styles.button}>
                    Зареєструватися
                  </button>
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

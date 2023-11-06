import React, { useState, useEffect, useRef } from 'react';
import styles from './ProfileChangeForm.module.css'
import styless from './ProfileChangeForm.module.css';
import Prices from './prices-item/Prices';
import { useLocation, useNavigate } from 'react-router-dom';
import { Validator } from '../../../../../../../../classes/validatior';
import { useForm } from 'react-hook-form';
import { UserService } from '../../../../../../../../services/user.service';
function ProfileChangeFormDesktop({ showForm, setShowForm }) {
  const serverUrl = 'https://localhost:7029/';
  const [currentPassword, setCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(false);
  const [changedPassword, setChangedPassword] = useState(false);

  const [currentImage, setCurrentImage] = useState(null);
  const [userData, setUserData] = useState(null);


  const { register, handleSubmit, reset, formState, watch, setValue } = useForm({
    mode: 'onChange'
  })
  const navigate = useNavigate(); // Получаем функцию для навигации
  const location = useLocation();
  const messageType = location.state?.type
  const message = location.state?.errorMessage
  const { errors } = formState
  const overlay = useRef(null);
  const handleTogglePasswordVisibility = (event) => {
    const id = event.currentTarget.id;

    switch (id) {
      case "current_password": setCurrentPassword(!currentPassword); break;
      case "new_password": setNewPassword(!newPassword); break;
      case "changed_password": setChangedPassword(!changedPassword); break;
    }
  };
  useEffect(() => {
    location.state = null
    // console.log(userData)
    if (userData == null) {
      UserService.getUserAllFileds(setUserData, setCurrentImage)
    } else {
      setValue('name', userData?.name)
      setValue('email', userData?.email)
      setValue('phone', userData?.phone)
      setUserData(null);
    }
    const timer = setTimeout(() => {
      if (showForm == false) {
        overlay.current.style.display = 'none';
      } else {
        overlay.current.style.display = 'flex';
      }

      // console.log("Таймер завершен!");
    }, 1000); // 3000 миллисекунд (3 секунды)

    // Здесь можно вернуть функцию, которая выполнится при размонтировании компонента
    return () => {
      clearTimeout(timer); // Очищаем таймер при размонтировании компонента
    };
  }, [showForm]);
  const handleToggleCloseForm = () => {
    reset();
    setShowForm(false);

  };

  const validatePasswordMatch = (value) => {
    const newPassword = watch('new_password'); // Получаем значение поля "Новий пароль"
    return newPassword === value || 'Password mismatch';
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]; // Получаем выбранный файл

    if (file) {
      // Здесь вы можете выполнить дополнительную обработку файла, если необходимо
      setValue('userImageId', file);
      setCurrentImage(URL.createObjectURL(file)); // Устанавливаем выбранный файл как аватар
    }
  };
  const logout = async () => {
    await UserService.logout(navigate);
    window.location.reload();
  }
  const updateUser = async (data) => {
    window.scrollTo(0, 0);
    try {
      location.state = null;

      const dataToSend = {};
      dataToSend.name = data.name
      dataToSend.email = data.email
      dataToSend.phone = data.phone
      dataToSend.password = data.new_password
      dataToSend.userImageId = data.userImageId
      // console.log(data.userImageId)
      UserService.setUserChangedData(navigate, dataToSend, data)



    } catch (error) {
      if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
      console.error("Ошибка изменения данних: ", error);
    }
  }
  return (
    <>
      <div ref={overlay} className={`${styles.overlay}`}>

        <form className={`${styles.profile_form} animated
                     ${showForm ? 'zoomInUp' : 'zoomOutDown'}`}
          onSubmit={handleSubmit(updateUser)}>
          <div className={styles.close_profile_form_button}
            onClick={handleToggleCloseForm}>
            +
          </div>
          <div className={styles.profile_content}>
            <div className={styles.content_element}>
              <div className={styles.avatar}>
                <img src={currentImage || './default_profile_icon.svg'} alt="Аватар" />
              </div>
              <label htmlFor="avatarInput" className={styles.avatar_change_button}>
                Змінити аватар
              </label>
              <div className={styles.logout} onClick={logout}>Logout</div>
              <input
                type="file"
                id="avatarInput"
                accept="image/*"
                {...register('userImageId', {

                })}
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>
            <div className={styles.content_element}>
              <div className={styles.sub_element}>
                <div className={styles.sub_header}>
                  Акаунт
                </div>
                <div className={styles.user_input}>
                  <div className={styles.input_header}>
                    Ім’я
                  </div>
                  <div className={styles.input_info}>
                    <input {...register('name', {
                    })} defaultValue={userData?.name} />
                  </div>
                </div>
                <div className={styles.user_input}>
                  <div className={styles.input_header}>
                    Email
                  </div>
                  <div className={styles.input_info}>
                    <input
                      {...register('email', {

                        pattern: {
                          value: Validator.getEmailRegExp(),
                          message: "Incorrect email"
                        }
                      })}
                      type='email' defaultValue={userData?.email} />
                  </div>
                </div>
                <div className={styles.user_input}>
                  <div className={styles.input_header}>
                    Телефон
                  </div>
                  <div className={styles.input_info}>
                    <input {...register('phone', {

                    })} defaultValue={userData?.phone} />
                  </div>
                </div>

              </div>
              <div className={styles.sub_element}>
                <div className={styles.sub_header}>
                  Змінити пароль
                </div>
                <div className={styles.user_input}>
                  <div className={styles.input_header}>
                    Поточний пароль
                  </div>
                  <div className={styles.input_info}>
                    <input
                      {...register('password', {

                        pattern: {
                          value: Validator.getPasswordRegExp(),
                          message: "minimum 6 characters, 1 big one small, number, special character"
                        }
                      })}
                      type={currentPassword ? 'text' : 'password'} />
                    <a id='current_password'
                      className={`${styles.input_hidder} 
                     ${currentPassword ? styles.input_visible : styles.input_hidden}`}
                      onClick={handleTogglePasswordVisibility}></a>
                  </div>
                  {errors.password && errors.password.message.length != 0 ? <div className={`${styles.error} animated fadeInDown`}>{errors.password?.message}</div> : ""}
                </div>
                <div className={styles.user_input}>
                  <div className={styles.input_header}>
                    Новий пароль
                  </div>
                  <div className={styles.input_info}>
                    <input
                      {...register('new_password', {

                        pattern: {
                          value: Validator.getPasswordRegExp(),
                          message: "minimum 6 characters, 1 big one small, number, special character"
                        }
                      })}
                      type={newPassword ? 'text' : 'password'} />
                    <a id='new_password'
                      className={`${styles.input_hidder} 
                     ${newPassword ? styles.input_visible : styles.input_hidden}`}
                      onClick={handleTogglePasswordVisibility}></a>

                  </div>
                  {errors.new_password && errors.new_password.message.length != 0 ? <div className={`${styles.error} animated fadeInDown`}>{errors.new_password?.message}</div> : ""}
                </div>
                <div className={styles.user_input}>
                  <div className={styles.input_header}>
                    Повторіть пароль
                  </div>
                  <div className={styles.input_info}>
                    <input
                      {...register('repeat_password', {

                        validate: validatePasswordMatch,
                      })}
                      type={changedPassword ? 'text' : 'password'} />
                    <a id='changed_password'
                      className={`${styles.input_hidder} 
                     ${changedPassword ? styles.input_visible : styles.input_hidden}`}
                      onClick={handleTogglePasswordVisibility}></a>
                  </div>
                  {errors.repeat_password && errors.repeat_password.message.length != 0 ? <div className={`${styles.error} animated fadeInDown`}>{errors.repeat_password?.message}</div> : ""}
                </div>
              </div>
              <div className={styles.sub_element}>
                <div className={styles.sub_header}>
                  Білінг
                </div>
                <div className={styles.biling_content}>
                  У цьому профілі ще немає платежів
                </div>
              </div>
              <div className={styles.sub_element}>
                <div className={styles.sub_header}>
                  Змінити план
                </div>
              </div>

              <div className={styles.sub_element}>

              </div>
            </div>
          </div>
          <Prices showForm={showForm} isMainPage={false} />
          <div className={styles.button}>
            <button className={styles.save_changes_button}>
              Зберегти зміни
            </button>
          </div>

        </form>
        {messageType == "error" ? <div class="fadeInDown animated errors" id="error">
          {message}
        </div> : messageType == "succsess" ? <div class="fadeInDown animated errors succsess" id="error">
          {message}
        </div> : ""}
      </div>


    </>
  )
}

export default ProfileChangeFormDesktop
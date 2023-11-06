import React, { useState, useEffect } from 'react';
import styles from './ProfileChangeForm.module.css'
import styless from './ProfileChangeForm.module.css';
function ProfileChangeFormMobile({ showForm, setShowForm }) {
  const [currentPassword, setCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(false);
  const [changedPassword, setChangedPassword] = useState(false);
  const overlay = React.createRef();
  const handleTogglePasswordVisibility = (event) => {
    const id = event.currentTarget.id;

    switch (id) {
      case "current_password": setCurrentPassword(!currentPassword); break;
      case "new_password": setNewPassword(!newPassword); break;
      case "changed_password": setChangedPassword(!changedPassword); break;
    }
  };
  useEffect(() => {
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
    setShowForm(false);

  };
  return (
    <>
      <div ref={overlay} className={`${styles.overlay}`}>

        <form className={`${styles.profile_form} animated
                     ${showForm ? 'zoomInUp' : 'zoomOutDown'}`}>
          <div className={styles.close_profile_form_button}
            onClick={handleToggleCloseForm}>
            +
          </div>
          <div className={styles.profile_content}>
            <div className={styles.content_element}>
              <div className={styles.sub_header}>
                Акаунт
              </div>
            </div>
            <div className={styles.content_element}>
              <div className={styles.avatar}>
                <img src="./default_profile_icon.svg" alt="" />
              </div>
              <div className={styles.avatar_change_button}>
                Змінити аватар
              </div>
            </div>
            <div className={styles.content_element}>
              <div className={styles.sub_element}>
                <div className={styles.user_input}>
                  <div className={styles.input_header}>
                    Ім’я
                  </div>
                  <div className={styles.input_info}>
                    <input type="text" />
                  </div>
                </div>
                <div className={styles.user_input}>
                  <div className={styles.input_header}>
                    Email
                  </div>
                  <div className={styles.input_info}>
                    <input type="email" />
                  </div>
                </div>
                <div className={styles.user_input}>
                  <div className={styles.input_header}>
                    Телефон
                  </div>
                  <div className={styles.input_info}>
                    <input type="tel" />
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
                    <input type={currentPassword ? 'text' : 'password'} />
                    <a id='current_password'
                      className={`${styles.input_hidder} 
                     ${currentPassword ? styles.input_visible : styles.input_hidden}`}
                      onClick={handleTogglePasswordVisibility}></a>
                  </div>
                </div>
                <div className={styles.user_input}>
                  <div className={styles.input_header}>
                    Новий пароль
                  </div>
                  <div className={styles.input_info}>
                    <input type={newPassword ? 'text' : 'password'} />
                    <a id='new_password'
                      className={`${styles.input_hidder} 
                     ${newPassword ? styles.input_visible : styles.input_hidden}`}
                      onClick={handleTogglePasswordVisibility}></a>

                  </div>
                </div>
                <div className={styles.user_input}>
                  <div className={styles.input_header}>
                    Повторіть пароль
                  </div>
                  <div className={styles.input_info}>
        
                    <input type={changedPassword ? 'text' : 'password'} />
                    <a id='changed_password'
                      className={`${styles.input_hidder} 
                     ${changedPassword ? styles.input_visible : styles.input_hidden}`}
                      onClick={handleTogglePasswordVisibility}></a>

                  </div>
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
                <div className={styles.save_changes_button}>
                  Зберегти зміни
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>


    </>
  )
}

export default ProfileChangeFormMobile
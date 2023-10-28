import React from 'react'
import styles from './Menu.module.css';
import NotificationsDesktop from '../../UI/notifications-item/Desktop/NotificationsDesktop';
const serverUrl = 'https://localhost:7029';
function MenuItemDesktop({ setShowForm,
    setShowNtfiForm,
    showNtfiForm,
    showCRPForm,
    setShowCRPForm,
    userData }) {
    let userImage;
    if(userData!=null){
        if (userData.isGoogle == true) {
            userImage = userData?.userImageId;
        } else {
            userImage = `${serverUrl}/avatar/${userData?.id}/${userData?.userImageId}`
        }
    }
   

    return (
        <div className={styles.menu}>

            <div className={styles.logo}>

                <img src='./logo.svg' />

            </div>
            <div className={styles.sub_menu}>
                <div className={styles.sub_element}>
                    <div className={styles.create_project_button} onClick={() => { setShowCRPForm(!showCRPForm); }}>
                        <span>+</span> Новий проект
                    </div>
                </div>
                <div className={styles.sub_element}>
                    <div className={styles.notification}
                        onClick={() => { setShowNtfiForm(!showNtfiForm); }}>
                        <img src="./notification_icon.svg" alt="" />
                        <NotificationsDesktop showNtfiForm={showNtfiForm} />
                    </div>

                </div>
                <div className={styles.sub_element}>
                    <div className={styles.profile}
                        onClick={() => { setShowForm(true); }}>
                        <img src={userImage || './default_profile_icon.svg'} alt="" />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default MenuItemDesktop
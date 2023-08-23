import React from 'react'
import styles from './Menu.module.css';
function MenuItemDesktop() {
    return (
        <div className={styles.menu}>

            <div className={styles.logo}><img src="./logo.svg" /></div>
            <div className={styles.sub_menu}>
                <div className={styles.sub_element}>
                    <div className={styles.create_project_button}>
                        <span>+</span> Новий проект
                    </div>
                </div>
                <div className={styles.sub_element}>
                    <div className={styles.notification}>
                        <img src="./notification_icon.svg" alt="" />
                    </div>
                </div>
                <div className={styles.sub_element}>
                    <div className={styles.profile}>
                        <img src="./default_profile_icon.svg" alt="" />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default MenuItemDesktop
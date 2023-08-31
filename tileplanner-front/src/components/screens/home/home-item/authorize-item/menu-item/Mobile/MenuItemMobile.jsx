import React from 'react'
import styles from './Menu.module.css'
function MenuItemMobile({setShowForm}) {
  return (
    <div className={styles.menu}>

            <div className={styles.logo}><img src="./logo.svg" /></div>
            <div className={styles.sub_menu}>
               
                    <div className={styles.create_project_button}>
                       +
                    </div>
               
                <div className={styles.sub_element}>
                    <div className={styles.notification}>
                        <img src="./notification_icon.svg" alt="" />
                    </div>
                </div>
                <div className={styles.sub_element}>
                    <div className={styles.profile}
                     onClick={()=>{setShowForm(true);}}>
                        <img src="./default_profile_icon.svg" alt="" />
                    </div>
                </div>
            </div>
        </div>
  )
}

export default MenuItemMobile
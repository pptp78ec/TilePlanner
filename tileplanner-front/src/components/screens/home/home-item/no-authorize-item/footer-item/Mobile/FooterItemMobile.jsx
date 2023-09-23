import React from 'react'
import styles from './Footer.module.css'
function FooterItemMobile() {
  return (
    <div className={styles.footer}>
        <div className={styles.sub_menu}>
          <div className={styles.sub_element}>Блог</div>
          <div className={styles.sub_element}>Галерея</div>
          <div className={styles.sub_element}>Ціни</div>
        </div>
        <div className={styles.additional}>
            <div className={styles.contact}>Зв’яжіться з нами</div>
            <div className={styles.logo}><img src="./logo_ver2.svg" /></div>
        </div>
   </div>
  )
}

export default FooterItemMobile
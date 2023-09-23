import React, { useState } from 'react';
import styles from './Menu.module.css'
import { Link } from 'react-router-dom';
function MenuItemMobile() {
  const [subMenuActive, setSubMenuActive] = useState(false);

  const toggleSubMenu = () => {
    setSubMenuActive(!subMenuActive);
  };

  return (
    <div className={styles.menu}>
      <div className={styles.sub_group}>
        <div className={styles.logo}><img src="./logo_mobile.svg" alt="Logo" /></div>
        <div className={` ${styles.sub_menu} animated ${subMenuActive ? 'fadeInRight' : 'fadeOutRight'}`}>
          <div className={styles.sub_element}>Блог</div>
          <div className={styles.sub_element}>Галерея</div>
          <div className={styles.sub_element}>Ціни</div>
          <div className={`${styles.sign_in} ${styles.sub_element}`}>
            <Link to={"/login"}>
              Увійти
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.authorize_sub_menu}>
        <div className={styles.sign_up}><Link to={"/registration"}>Зареєструватися</Link> </div>
        <div className={`${styles.burger_button}  ${subMenuActive ? styles.active_button : ''}`} onClick={toggleSubMenu}>
          <img src="./burger_menu.svg" alt="Burger Menu" />
        </div>
      </div>
    </div>
  );
}

export default MenuItemMobile
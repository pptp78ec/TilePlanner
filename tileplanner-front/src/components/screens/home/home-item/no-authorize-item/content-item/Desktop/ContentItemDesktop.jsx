import React from 'react'
import styles from './Content.module.css'
import Prices from '../../UI/prices-item/Prices';
import { Link } from 'react-router-dom';

//Футер, розделить на компоненты, и подумать о адаптации

function ContentItem() {

  const mainPage = true;
  return (
    <div className={styles.content}>
      <div className={styles.content_element_1}>
        <div className={styles.sub_element}>
          <div className={styles.text_content}>
            <div className={styles.header}>WayDo ваш помічник у подорожах</div>
            <div className={styles.text}>&emsp;&emsp;&emsp;Формуйте маршрути, працюйте з подіями та завданнями та відстежуйте бюджет в одному місці</div>
          </div>
          <div className={styles.button_wrap}>
            <Link to={'registration'}><div className={styles.button}>Спланувати подорож</div></Link>

          </div>

        </div>
      </div>
      <div className={styles.content_element_2}>
        <div className={styles.wrapper}>
          <div className={styles.abilities_wrap}>
            <div className={styles.ability_item}>
              <div className={styles.ability_icon}>
                <img src="ability_icon_1.svg" alt="" />
              </div>
              <div className={styles.ability_info}>
                Формуйте<br /> завдання
              </div>
            </div>
            <div className={styles.ability_item}>
              <div className={styles.ability_icon}>
                <img src="ability_icon_2.svg" alt="" />
              </div>
              <div className={styles.ability_info}>
                Встановлюйте<br />нагадування
              </div>
            </div>
            <div className={styles.ability_item}>
              <div className={styles.ability_icon}>
                <img src="ability_icon_3.svg" alt="" />
              </div>
              <div className={styles.ability_info}>
                Записуйте<br /> нотатки
              </div>
            </div>
            <div className={styles.ability_item}>
              <div className={styles.ability_icon}>
                <img src="ability_icon_4.svg" alt="" />
              </div>
              <div className={styles.ability_info}>
                Складайте списки
              </div>
            </div>
            <div className={styles.ability_item}>
              <div className={styles.ability_icon}>
                <img src="ability_icon_5.svg" alt="" />
              </div>
              <div className={styles.ability_info}>
                Додавайте<br /> фото
              </div>
            </div>
            <div className={styles.ability_item}>
              <div className={styles.ability_icon}>
                <img src="ability_icon_6.svg" alt="" />
              </div>
              <div className={styles.ability_info}>
                Формуйте<br /> маршрут на карті
              </div>
            </div>
            <div className={styles.ability_item}>
              <div className={styles.ability_icon}>
                <img src="ability_icon_7.svg" alt="" />
              </div>
              <div className={styles.ability_info}>
                Відстежуйте<br /> бюджет<br /> подорожі
              </div>
            </div>
            <div className={styles.ability_item}>
              <div className={styles.ability_icon}>
                <img src="ability_icon_8.svg" alt="" />
              </div>
              <div className={styles.ability_info}>
                Зберігайте все в<br /> одному місці
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className={styles.content_element_3}>
        <div className={styles.example}>
          <img src="./example.svg" alt="" />
        </div>
      </div>
      <div className={styles.content_element_4}>
        <Prices />
      </div>
    </div>
  )
}
//Футер, розделить на компоненты и подумать о адаптации
export default ContentItem
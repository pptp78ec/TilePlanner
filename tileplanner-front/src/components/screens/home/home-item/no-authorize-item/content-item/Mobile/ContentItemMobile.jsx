import React from 'react'
import styles from './Content.module.css'
function ContentItemMobile() {
    return (
        <>
            <div className={styles.content}>
                <div className={styles.content_element_1}>
                    <div className={styles.sub_element}>
                        <div className={styles.header}>WayDo<br /> ваш помічник у подорожах</div>
                    </div>
                    <div className={styles.sub_element}>
                        <div className={styles.example}>
                            <img src="./example.svg" alt="" />
                        </div>
                    </div>
                    <div className={styles.sub_element}>
                        <div className={styles.text}>Формуйте маршрути, працюйте з подіями та завданнями та відстежуйте бюджет в одному місці</div>
                    </div>
                    <div className={styles.sub_element}>

                        <div className={styles.button}>Спланувати подорож</div>

                    </div>
                </div>

                <div className={styles.content_element_2}>
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

        </>
    )
}

export default ContentItemMobile
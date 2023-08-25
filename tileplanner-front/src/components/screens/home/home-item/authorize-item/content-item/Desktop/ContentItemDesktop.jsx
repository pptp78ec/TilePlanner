import React from 'react'
import styles from './Content.module.css'
function ContentItemDesktop() {
    return (
        <>
            <div className={styles.content}>
                <div className={styles.header}>
                    Мої проекти
                </div>
                <div className={styles.projects}>
                    <div className={styles.project}>
                        <div className={styles.project_preview}>
                            <img src="" alt="" />
                        </div>
                        <div className={styles.project_name}>
                            Проект 1
                        </div>
                    </div>
                    <div className={styles.project}>
                        <div className={styles.project_preview}>
                            <img src="" alt="" />
                        </div>
                        <div className={styles.project_name}>
                            Проект 2
                        </div>
                    </div>
                    <div className={styles.project}>
                        <div className={styles.project_preview}>
                            <img src="" alt="" />
                        </div>
                        <div className={styles.project_name}>
                            Проект 3
                        </div>
                    </div>

                </div>
                {/* <div className={styles.profile_form}>
                    <div className={styles.profile_header}>
                        Акаунт
                    </div>
                    <div className={styles.profile_content}>
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
                                        <input id='input_name' type="text" />
                                    </div>
                                </div>
                                <div className={styles.user_input}>
                                    <div className={styles.input_header}>
                                    Email
                                    </div>
                                    <div className={styles.input_info}>
                                        <input id='input_email' type="email" />
                                    </div>
                                </div>
                                <div className={styles.user_input}>
                                    <div className={styles.input_header}>
                                       Телефон
                                    </div>
                                    <div className={styles.input_info}>
                                        <input id='input_name' type="tel" />
                                    </div>
                                </div> 

                            </div>
                        </div>
                        <div className={styles.sub_element}>

                        </div>
                        <div className={styles.sub_element}></div>
                        <div className={styles.sub_element}></div>
                    </div>
                </div> */}
            </div>
        </>
    )
}

export default ContentItemDesktop
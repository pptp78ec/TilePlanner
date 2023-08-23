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
                    
                </div>
            </div>

        </>
    )
}

export default ContentItemMobile
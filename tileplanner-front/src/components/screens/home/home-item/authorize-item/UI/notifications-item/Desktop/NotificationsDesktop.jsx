import React from 'react'
import styles from './Notifications.module.css'
export default function NotificationsDesktop({ showNtfiForm }) {
    return (

        <form className={`${styles.notifications_form} animated
                     ${showNtfiForm ? 'zoomIn' : 'zoomOut'}`}>
            <div className={styles.notifications}>
                <div className={styles.notification}>
                    <div className={styles.date}>
                        1 вересня 2023
                    </div>
                    <div className={styles.aditional}>
                        <div className={styles.task_name}>
                            Відвідати Кременчук
                        </div>
                        <div className={styles.task_time}>
                            16:30
                        </div>
                    </div>
                </div>
                <div className={styles.notification}>
                    <div className={styles.date}>
                        31 серпня 2023
                    </div>
                    <div className={styles.aditional}>
                        <div className={styles.task_name}>
                            Зібрати речі
                        </div>
                        <div className={styles.task_time}>
                            12:00
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}


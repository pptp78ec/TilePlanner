import React from 'react'
import styles from './Content.module.css'
function ContentItemMobile() {
  return (
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
</div>
  )
}

export default ContentItemMobile
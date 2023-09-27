import React from 'react'
import styles from './ProjectItem.module.css'
export default function ProjectItemDesktop({name}) {
    return (
        <div className={styles.project}>
            <div className={styles.project_preview}>
                <img src="" alt="" />
            </div>
            <div className={styles.project_name}>
                {name}
            </div>
        </div>
    )
}

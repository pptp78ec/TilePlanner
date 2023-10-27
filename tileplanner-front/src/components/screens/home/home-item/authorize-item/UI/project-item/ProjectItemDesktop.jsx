import React from 'react'
import styles from './ProjectItem.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { ItemService } from '../../../../../../../services/item.service';
export default function ProjectItemDesktop({ project,setIsUpdatedProjects }) {
    const navigate = useNavigate();
    const [isMenuOpen, setMenuOpen] = useState(false);
    function goTo() {
        navigate('/project/' + project.id)
    }
    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };
    const deleteProject =async () => {
      await ItemService.delete_item(project.id);
        setIsUpdatedProjects(true);
    };

    return (
        <div className={styles.project} >
            <div className={styles.project_preview} onClick={goTo}>
                <img src="./project_background.svg" alt="" />
            </div>
            <div className={styles.project_data}>
                <div className={styles.project_name} >
                    {project.header}
                </div>
                <div className={styles.project_sub_menu} onClick={toggleMenu}>
                    . . .
                    {isMenuOpen && (
                        <div className={styles.sub_menu} >
                            <div className={styles.sub_element} onClick={deleteProject}>
                                Видалити
                            </div>
                        </div>
                    )}

                </div>
            </div>

        </div>
    )
}

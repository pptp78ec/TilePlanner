import React, { useRef } from 'react'
import styles from './ToDo.module.css'
import { useState } from 'react';
import ResizableComponent from '../resizable-component-item/ResizableComponentItem';

export default function ToDoItem() {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };
    const handleRemovePoints = async () => {

    }
    return (
        <>
                <div className={styles.toDo_item}>
                    <div className={styles.toDo_header}>
                        <div className={styles.header_text}>
                            Список завдань
                        </div>
                        <div className={styles.header_submenu} onClick={toggleMenu}>
                            . . .
                            {isMenuOpen && (
                                <div className={styles.sub_menu}>
                                    <div className={styles.sub_element} onClick={handleRemovePoints}>
                                        Очистити
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.toDo_list}>

                    </div>
                </div>
        </>

    )
}

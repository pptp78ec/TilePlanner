import React from 'react'
import styles from './ToDo.module.css'
import { useState } from 'react';
export default function ToDoItem() {
    const [width, setWidth] = useState(200); // Начальная ширина элемента
    const [height, setHeight] = useState(200); // Начальная ширина элемента
    const handleResize = (e) => {
        // Обработчик изменения размера
        setWidth(e.clientX);
        setHeight(e.clientY);
    };
    return (
        <div
            resizeble={true}
            className={styles.resizable_element}
            style={{ width: `${width}px`, height: `${height}px`}}
            onMouseMove={handleResize}
        >
            Размер можно изменять
        </div>




        // <div className="toDo_item">
        //     <div className={styles.toDo_header}>
        //         <div className={styles.header_text}>
        //             Список завдань
        //         </div>
        //         <div className={styles.header_submenu}>
        //             . . .
        //         </div>
        //     </div>
        //     <div className={styles.toDo_list}>
        //         <div className={styles.toDo_item}>

        //         </div>
        //     </div>
        // </div>
    )
}

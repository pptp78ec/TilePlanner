import React, { useEffect, useRef, useState } from 'react'
import styles from './NotesTile.module.css';
export default function NotesTileItem({ itemData, setIsUpdateTile, tilesData, setTilesData, index }) {
    const [text, setText] = useState(itemData.description);

    useEffect(() => {
      document.getElementsByClassName(styles.notes_text)[0].textContent=itemData.description
    }, [itemData.description]);

    // Обработчик изменения текста
    const handleTextChange = (event) => {
        const newText = event.target.value;
        const updatedTilesData = [...tilesData];
        console.log(index)
        updatedTilesData[index].description = newText;
        
        setTilesData(updatedTilesData);

        setText(newText); // Обновляем локальное состояние
    };

    return (
        <div className={styles.notes_tile}>
            <textarea
                placeholder="Залиште тут свої нотатки"
                className={styles.notes_text}
                onChange={handleTextChange}
                // value={text}
            />
        </div>
    );
}

import React from 'react'
import styles from './ContextMenu.module.css';
import { ItemService } from '../../../../../../../../services/item.service';
export default function ContextMenuItem({
    tilesData,
    setTilesData,
    setIsUpdateTile,
    setContextMenuPosition,
    contextMenuPosition,
    itemData,
    index,
 }) {

    async function handleMenuClick(choise) {
        if (choise == 'delete') {
            const updatedData = tilesData.map((tile, i) => {
                if (i === index) {
                    // Если это элемент с выбранным индексом, устанавливаем isDelete в true
                    return { ...tile, isDeleted: true };
                }
                return tile;
            });
    
            // Устанавливаем новый массив данных с помощью setTilesData
            setTilesData(updatedData);
            // Устанавливаем флаг обновления
           
        }
        setContextMenuPosition({
            left: 0,
            top: 0,
        });

    }
    return (
        <>
            {contextMenuPosition.left > 0 && contextMenuPosition.top > 0 && ( // Показываем меню только если установлены координаты
                <div
                    className={styles.contextMenu}
                    style={{
                        left: 10,
                        top: 10,
                    }}
                >
                    <div className={styles.menuItem} onClick={() => { handleMenuClick("delete") }}>
                        Видалити
                    </div>
                    <div className={styles.menuItem} onClick={() => { handleMenuClick("close") }}>
                        Закрити
                    </div>
                </div>
            )}
        </>

    )
}

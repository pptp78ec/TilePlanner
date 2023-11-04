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
            const newTilesData = [...tilesData]
            console.log(newTilesData);
            newTilesData.pop(itemData);
            setTilesData(newTilesData);
            await ItemService.delete_item(itemData.id);
            setIsUpdateTile(true);
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

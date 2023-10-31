import React, { useEffect, useRef, useState } from 'react';
import ImageTileItem from '../image-tile-item/ImageTileItem';
import styles from './DefaultItem.module.css';
import { ItemService } from '../../../../../../../services/item.service';
import ContextMenuItem from './UI/ContextMenuItem';
import NotesTileItem from '../notes-tile-item/NotesTileItem';

export default function DefaultItem({ itemData, setIsUpdateTile, setIsWaitUpdate, setTilesData, tilesData, index }) {
    const [isImage, setIsImage] = useState(false);
    const [isNotes, setIsNotes] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ left: 0, top: 0 });
    const defaultItemRef = useRef();
    useEffect(() => {
        switch (itemData.itemtype) {
            case 'IMAGE':
                setIsImage(true);
                break;
            case 'NOTES':
                setIsNotes(true);
                break;
            default:
                setIsImage(false);
        }
    }, []);

    const handleContextMenu = (e) => {
        e.preventDefault(); // Предотвращает появление контекстного меню браузера
        const boundingBox = defaultItemRef.current.getBoundingClientRect(); // Получаем координаты DefaultItem
        setContextMenuPosition({
            left: e.clientX - boundingBox.left,
            top: e.clientY - boundingBox.top,
        });
    };

    if (isImage) {
        return (
            <div
                className={styles.tile}
                ref={defaultItemRef}
                style={{
                    overflow: 'hidden',
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                }}
                onContextMenu={handleContextMenu}
            >
                <ContextMenuItem
                    tilesData={tilesData}
                    setIsUpdateTile={setIsUpdateTile}
                    setTilesData={setTilesData}
                    setContextMenuPosition={setContextMenuPosition}
                    contextMenuPosition={contextMenuPosition}
                    itemData={itemData}
                />

                <ImageTileItem
                    itemData={itemData}
                    setIsUpdateTile={setIsUpdateTile} />
            </div>
        );
    }
    if (isNotes) {
        return (
            <div
                className={styles.tile}
                ref={defaultItemRef}
                style={{
                    overflow: 'hidden',
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                }}
                onContextMenu={handleContextMenu}
            >
                <ContextMenuItem
                    tilesData={tilesData}
                    setIsUpdateTile={setIsUpdateTile}
                    setTilesData={setTilesData}
                    setContextMenuPosition={setContextMenuPosition}
                    contextMenuPosition={contextMenuPosition}
                    itemData={itemData}
                    index={index}
                />

                <NotesTileItem
                    itemData={itemData}
                    setIsUpdateTile={setIsUpdateTile}
                    tilesData={tilesData}
                    setTilesData={setTilesData}
                    index={index}
                     />
            </div>
        );
    }

    return null;
}

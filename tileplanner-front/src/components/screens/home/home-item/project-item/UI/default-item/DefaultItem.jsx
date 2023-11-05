import React, { useEffect, useRef, useState } from 'react';
import ImageTileItem from '../image-tile-item/ImageTileItem';
import styles from './DefaultItem.module.css';
import { ItemService } from '../../../../../../../services/item.service';
import ContextMenuItem from './UI/ContextMenuItem';
import NotesTileItem from '../notes-tile-item/NotesTileItem';
import TaskListTileItem from '../taskList-tile-item/TaskListTileItem';
import BudgetTileItem from '../budget-tile-item/BudgetTileItem';

export default function DefaultItem({
    itemData,
    setIsUpdateTile,
    setIsWaitUpdate,
    setTilesData,
    tilesData,
    index,
    setIsContextMenuVisible
}) {
    const [isImage, setIsImage] = useState(false);
    const [isNotes, setIsNotes] = useState(false);
    const [isTaskList, setIsTaskList] = useState(false);
    const [isBudget, setIsBudget] = useState(false);
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
            case 'TASKLIST':
                setIsTaskList(true);
                break;
            case 'BUDGET':
                setIsBudget(true);
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
    // console.log(itemData)
if(itemData.isDeleted!=true){
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
                    index={index}
                />

                <ImageTileItem
                    itemData={itemData}
                    index={index}
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
                    index={index}
                    setIsUpdateTile={setIsUpdateTile}
                    tilesData={tilesData}
                    setTilesData={setTilesData}
                />
            </div>
        );
    }
    if (isTaskList) {
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
                onDoubleClick={(e) => { e.preventDefault(); setContextMenuPosition(false) }}
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

                <TaskListTileItem
                    itemData={itemData}
                    index={index}
                    setIsUpdateTile={setIsUpdateTile}
                    tilesData={tilesData}
                    setTilesData={setTilesData}
                />
            </div>
        );
    }
    if (isBudget) {
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
                onDoubleClick={(e) => { e.preventDefault(); setContextMenuPosition(false) }}
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

                <BudgetTileItem
                    itemData={itemData}
                    index={index}
                    setIsUpdateTile={setIsUpdateTile}
                    tilesData={tilesData}
                    setTilesData={setTilesData}
                />
            </div>
        );
    }
}
   


    return null;
}

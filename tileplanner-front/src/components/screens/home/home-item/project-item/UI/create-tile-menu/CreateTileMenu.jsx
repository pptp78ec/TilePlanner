import React from 'react'
import styles from './CreateTileMenu.module.css'
export default function ContextMenu({ isVisible, position, onMenuItemClick,setIsContextMenuVisible }) {
    if (!isVisible) return null;
  
    const handleMenuItemClick = (item) => {
      if(item=='close'){
        setIsContextMenuVisible(false);
        return;
      }
      onMenuItemClick(item, position);
    
    };
  
    return (
      <div
        className={styles.context_menu}
        style={{ left: position.left, top: position.top }}
      >
        <div onClick={() => handleMenuItemClick("image")}>Зображення</div>
        <div onClick={() => handleMenuItemClick("notes")}>Нотатник</div>
        <div onClick={() => handleMenuItemClick("task_list")}>Список завдань</div>
        <div onClick={() => handleMenuItemClick("budget")}>Бюджет</div>
        <div onClick={() => handleMenuItemClick("close")}>Закрити</div>
        {/* Добавьте другие пункты меню, если необходимо */}
      </div>
    );
  }

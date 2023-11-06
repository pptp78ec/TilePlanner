import React, { useEffect, useState } from 'react'
import styles from './TaskListTile.module.css'
import { UserService } from '../../../../../../../services/user.service';
import { ItemService } from '../../../../../../../services/item.service';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';

export default function TaskListTileItem({
    itemData,
    setIsUpdateTile,
    tilesData,
    setTilesData,
    index
}) {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isEditing, setEditing] = useState(false);
    const [isEditingTask, setIsEditingTask] = useState(null);
    const [headerText, setHeaderText] = useState(itemData?.header); // Стейт для текста заголовка
    const [headerTextTask, setHeaderTextTask] = useState(null);
    const [taskList, setTaskList] = useState(null);
    const [calendarActivity, setCalendarActivity] = useState([]);
    const [createIsActive, setCreateIsActive] = useState(false);
    let { id } = useParams();
    useEffect(() => {
        // console.log(tilesData)
        if (tilesData != null) {
            const taskListBuffer = [];
            tilesData.map((item, index) => {
                if (item.parentId == itemData.id && item.itemtype == 'TASK') {
                    taskListBuffer.push(item);
                }
            })
            // console.log(taskListBuffer)
            setTaskList(taskListBuffer);
            // console.log(taskListBuffer)
            if (taskListBuffer) {
                let cald = [];
                taskListBuffer.map((item, index) => {
                    cald.push({ id: index, active: false });
                })
                setCalendarActivity(cald);

                setIsEditingTask(new Array(taskListBuffer.length).fill(false));
                setHeaderTextTask(taskListBuffer ? taskListBuffer.map(item => item.header) : []);


            }

        } else {
            setIsUpdateTile(true);
        }

    }, [tilesData])
    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };
    const handleEditHeader = () => {
        setEditing(true); // Включаем режим редактирования
    };
    const handleSaveHeader = () => {
        setEditing(false); // Выключаем режим редактирования
        setHeaderText(headerText);
        const newData = [...tilesData]
        newData[index].header = headerText;
        setTilesData(newData);
    };
    const handleHeaderChange = (e) => {
        setHeaderText(e.target.value); // Обновляем значение текста заголовка
    };
    const handleRemovePoints = async () => {
        const updatedTilesData = tilesData.map((tile) => {
            // Найдите соответствующий элемент в taskList
            const taskListItem = taskList.find((task) => task.id == tile.id);
    
            // Если такой элемент найден и он не удален (isDeleted: false), установите isDeleted: true
            if (taskListItem && !tile.isDeleted) {
                return { ...tile, isDeleted: true };
            }
    
            return tile; // Возвращаем неизмененные элементы
        });
    
        // Обновляем tilesData с помощью setTilesData
        setTilesData(updatedTilesData);
        // console.log(tilesData);
        setTimeout(()=>{
            setIsUpdateTile(true); // Устанавливаем флаг обновления
        },3000)
      
    }
    const handleCalendarIconClick = (event) => {
        const id = event.target.id;
        // console.log(id);
        if (id != null) {
            setCalendarActivity((prevCalendarActivity) =>
                prevCalendarActivity.map((item) => {
                    // console.log(item);
                    if (item.id == id) {
                        return { ...item, active: !item.active };
                    }
                    return item;
                })
            );
        }
    };
    const handleCalendarChange = async (itemId, newData) => {
        // В этой функции вы можете использовать dataId и newValue
        // console.log(`Calendar with data-id ${itemId} changed to ${newData.toLocaleString()}`);
        setTilesData((prevTilesData) => {
            // Создаем новый массив, в котором обновляем элемент с соответствующим id
            return prevTilesData.map((tile) => {
                if (tile.id === itemId) {
                    // Копируем текущий элемент и обновляем isDone
                    return { ...tile, taskSetDate: newData };
                }
                return tile; // Возвращаем неизмененные элементы
            });
        });
        setCalendarActivity(false);
    };
    const handleCheckboxChange = async (event) => {
        const dateId = event.currentTarget.getAttribute('dateId');

        const isChecked = event.target.checked;
        // console.log(isChecked)
        setTilesData((prevTilesData) => {
            // Создаем новый массив, в котором обновляем элемент с соответствующим id
            return prevTilesData.map((tile) => {
                if (tile.id === dateId) {
                    // Копируем текущий элемент и обновляем isDone
                    return { ...tile, isDone: isChecked };
                }
                return tile; // Возвращаем неизмененные элементы
            });
        });
        //  setIsUpdateTile(true);
    };
    const handleCreateItem = async (event) => {
        // console.log("OK");
        await ItemService.create_tile({ left: 0, top: 0 }, itemData.id, 'TASK')
        setTimeout(()=>{
            setIsUpdateTile(true);
        },1000)
      

    };
    const handleEditHeaderTask = (index) => {
        const newIsEditingTask = [...isEditingTask];
        newIsEditingTask[index] = true;
        setIsEditingTask(newIsEditingTask);
    };
    const handleHeaderChangeTask = (e, index) => {
        setHeaderTextTask((prevHeaderTextTask) => {
            const newHeaderTextTask = [...prevHeaderTextTask];
            newHeaderTextTask[index] = e.target.value;
            return newHeaderTextTask;
        });
    };
    
    const handleSaveHeaderTask = (index) => {
        setIsEditingTask((prevIsEditingTask) => {
            const newIsEditingTask = [...prevIsEditingTask];
            newIsEditingTask[index] = false;
            return newIsEditingTask;
        });
    
        setTaskList((prevTaskList) => {
            const newTaskList = [...prevTaskList];
            newTaskList[index].header = headerTextTask[index];
            return newTaskList;
        });
    
        const updatedTile = taskList[index];
        setTilesData((prevTilesData) => {
            const newData = [...prevTilesData];
            const tileIndex = newData.findIndex((tile) => tile.id === updatedTile.id);
            if (tileIndex !== -1) {
                newData[tileIndex] = updatedTile;
            }
            return newData;
        });
    };
    
    return (
        <div className={styles.taskList_tile}>
            <div className={styles.toDo_header}>
                {isEditing ? ( // Если режим редактирования включен, показываем input
                    <input
                        type="text"
                        value={headerText}
                        onChange={handleHeaderChange}
                        onBlur={handleSaveHeader}
                        autoFocus
                    />
                ) : (
                    <div className={styles.header_text} onClick={handleEditHeader}>
                        {headerText}
                    </div>
                )}
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

            <div className={styles.taskList_list}>
                {taskList != null ? taskList.map((item, index) => {
                    return (
                        <div key={index} className={item.isDone ? `${styles.toDo_item} ${styles.isVisited}` : `${styles.toDo_item} ${styles.isNotVisited}`}>
                            <div className={styles.item_checkbox}>
                                <label className={styles.custom_checkbox} >
                                    <input checked={item.isDone ? true : false} type="checkbox" dateId={item.id} onClick={handleCheckboxChange} />
                                    <span className={styles.checkmark}></span>
                                </label>
                            </div>
                            <div className={styles.item_address}>
                                {isEditingTask[index] ? (
                                    <input
                                        type="text"
                                        value={headerTextTask[index]}
                                        onChange={(e) => handleHeaderChangeTask(e, index)}
                                        onBlur={() => handleSaveHeaderTask(index)}
                                        autoFocus
                                    />
                                ) : (
                                    <div className={styles.item_header_text} onClick={() => handleEditHeaderTask(index)}>
                                        {item.header}
                                    </div>
                                )}
                            </div>
                            <div className={styles.calendar_icon} id={index} onClick={handleCalendarIconClick}></div>
                            {calendarActivity[index]?.active ? <div className={`${styles.item_calendar} animated`}><Calendar onChange={(newDate) => handleCalendarChange(item.id, newDate)} defaultValue={item.taskSetDate ? new Date(item.taskSetDate) : new Date()} /></div> : ""}
                        </div>
                    )

                }) : ""}
                <div className={styles.toDo_create} onClick={() => { handleCreateItem() }}>
                    +
                </div>
            </div>
        </div>
    )
}

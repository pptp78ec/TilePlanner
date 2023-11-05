import React, { useEffect, useState } from 'react';
import styles from './BudgetTile.module.css';

export default function BudgetTileItem({
    itemData,
    setIsUpdateTile,
    tilesData,
    setTilesData,
    index
}) {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isEditing, setEditing] = useState(false);
    const [headerText, setHeaderText] = useState(itemData?.header); // Стейт для текста заголовка
    const [budgetItems, setBudgetItems] = useState([]);
    const [sum, setSum] = useState(0);
    useEffect(() => {
        setHeaderText(itemData?.header);
        // Разбор и установка budgetItems
        const budgetItems = itemData.budgetItems || [];
        const budgetItemsWithIndex = budgetItems.map((item, index) => ({
            ...item,
            isEditing: false, // Стейт для режима редактирования
            index: index
        }));
        let suma = 0;
        budgetItemsWithIndex.map((item) => {
            suma += item.price
        })
        setSum(suma)
        setBudgetItems(budgetItemsWithIndex);
    }, []);

    const handleHeaderChange = (e) => {
        setHeaderText(e.target.value); // Обновляем значение текста заголовка
    };

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const handleEditHeader = () => {
        setEditing(true); // Включаем режим редактирования
    };

    // Функция для переключения режима редактирования элемента budgetItem
    const handleEditBudgetItem = (itemIndex) => {
        setBudgetItems((prevBudgetItems) => {
            const updatedBudgetItems = [...prevBudgetItems];
            updatedBudgetItems[itemIndex].isEditing = true;
            return updatedBudgetItems;
        });
    };

    // Функция для сохранения изменений в элементе budgetItem
    const handleSaveBudgetItem = (itemIndex) => {
        setBudgetItems((prevBudgetItems) => {
            const updatedBudgetItems = [...prevBudgetItems];
            updatedBudgetItems[itemIndex].isEditing = false;
            return updatedBudgetItems;
        });

        // Проверка на пустые поля и price != 0
        const { purpose, place, price } = budgetItems[budgetItems.length - 1];
        let isAdd = false;
        console.log(purpose, place, price);
        if (purpose !== '' || place !== '' || parseFloat(price) !== 0) {
            isAdd = true;
            // Создаем новый элемент и добавляем его в конец массива
            const newItem = { purpose: '', place: '', price: 0 };
            setBudgetItems((prevBudgetItems) => [...prevBudgetItems, newItem]);
        }
        let suma = 0;
        budgetItems.map((item) => {
            suma += parseFloat(item.price);
        });
        setSum(suma);

        setTilesData((prevTilesData) => {
            const updatedTilesData = [...prevTilesData];
            // Уберем лишние поля из budgetItems
            const { purpose, place, price } = budgetItems[itemIndex];
            updatedTilesData[index].budgetItems[itemIndex] = { purpose, place, price };
            if (isAdd) {
                updatedTilesData[index].budgetItems.push(
                    {
                        purpose: "",
                        place:"",
                        price:0
                    })
            }
            return updatedTilesData;
        });

        // Вы можете здесь отправить обновленные данные на сервер, если необходимо.
    };


    // Функция для изменения значения в элементе budgetItem
    const handleBudgetItemChange = (e, itemIndex, field) => {
        setBudgetItems((prevBudgetItems) => {
            const updatedBudgetItems = [...prevBudgetItems];
            updatedBudgetItems[itemIndex][field] = e.target.value;
            return updatedBudgetItems;
        });
    };

    // Функция для удаления элемента budgetItem
const handleRemovePoints = (itemIndex) => {
    setBudgetItems((prevBudgetItems) => {
        const updatedBudgetItems = [...prevBudgetItems];
        updatedBudgetItems.splice(itemIndex, 1);
        return updatedBudgetItems;
    });

    setTilesData((prevTilesData) => {
        const updatedTilesData = [...prevTilesData];
        let bufferData=[...budgetItems];
        bufferData.splice(itemIndex,1);
        updatedTilesData[index].budgetItems = bufferData;
        return updatedTilesData;
    });

    // Пересчитываем сумму после удаления
    let suma = 0;
    updatedBudgetItems.map((item) => {
        suma += parseFloat(item.price);
    });
    setSum(suma);

    // Вы можете здесь отправить обновленные данные на сервер, если необходимо.
};

    const handleKeyDown = (e, itemIndex, itemtype) => {
        // Обработка нажатия клавиши Delete
        switch (e.key) {
            case 'Delete': handleRemovePoints(itemIndex); break;
            case 'Enter': handleSaveBudgetItem(itemIndex); break;
        }

    };
    const handleSaveHeader = () => {
        setEditing(false); // Выключаем режим редактирования
        setHeaderText(headerText);
        const newData = [...tilesData]
        newData[index].header = headerText;
        setTilesData(newData);
    };
    return (
        <div className={styles.budget_tile}>
            <div className={styles.toDo_header}>
                {isEditing ? (
                    // Режим редактирования заголовка
                    <input
                        type="text"
                        value={headerText}
                        onChange={handleHeaderChange}
                        onBlur={() => handleSaveHeader()} // Сохранение при потере фокуса
                        autoFocus
                    />
                ) : (
                    // Режим отображения заголовка
                    <div className={styles.header_text} onClick={handleEditHeader}>
                        {headerText}
                    </div>
                )}
                <div className={styles.header_submenu} onClick={toggleMenu}>
                    . . .
                    {isMenuOpen && (
                        <div className={styles.sub_menu}>
                            <div className={styles.sub_element} onClick={handleRemovePoints}>
                                {/* Очистити */}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.budget_list}>
                <div className={styles.budget_list_items}>
                    {budgetItems ? budgetItems.map((item, itemIndex) => (
                        <div key={itemIndex}
                            className={item.isEditing ? `${styles.budget_item} ${styles.isEdit}` : styles.budget_item}
                        >
                            {item.isEditing ? (
                                // Режим редактирования budgetItem
                                <>
                                    <div className={styles.item_purpose} onClick={() => handleEditBudgetItem(itemIndex)}>
                                        <input
                                            type="text"
                                            value={item.purpose}
                                            onChange={(e) => handleBudgetItemChange(e, itemIndex, 'purpose')}
                                            onBlur={() => handleSaveBudgetItem(itemIndex)} // Автоматическое сохранение при потере фокуса
                                            onKeyDown={(e) => handleKeyDown(e, itemIndex, 'purpose')} // Обработчик нажатия клавиши
                                        />
                                    </div>
                                    <div className={styles.item_place} onClick={() => handleEditBudgetItem(itemIndex)}>
                                        <input
                                            type="text"
                                            value={item.place}
                                            onChange={(e) => handleBudgetItemChange(e, itemIndex, 'place')}
                                            onBlur={() => handleSaveBudgetItem(itemIndex)} // Автоматическое сохранение при потере фокуса
                                            onKeyDown={(e) => handleKeyDown(e, itemIndex, 'place')} // Обработчик нажатия клавиши
                                        />
                                    </div>
                                    <div className={styles.item_price} onClick={() => handleEditBudgetItem(itemIndex)}>
                                        <input
                                            type="text"
                                            value={item.price}
                                            onChange={(e) => handleBudgetItemChange(e, itemIndex, 'price')}
                                            onBlur={() => handleSaveBudgetItem(itemIndex)} // Автоматическое сохранение при потере фокуса
                                            onKeyDown={(e) => handleKeyDown(e, itemIndex, 'price')} // Обработчик нажатия клавиши  
                                        />
                                    </div>
                                </>
                            ) : (
                                // Режим отображения budgetItem
                                <>
                                    <div className={styles.item_purpose} onClick={() => handleEditBudgetItem(itemIndex)}>
                                        {item.purpose}
                                    </div>
                                    <div className={styles.item_place} onClick={() => handleEditBudgetItem(itemIndex)}>
                                        {item.place}
                                    </div>
                                    <div className={styles.item_price} onClick={() => handleEditBudgetItem(itemIndex)}>
                                        {item.price}
                                    </div>
                                </>
                            )}
                        </div>
                    )) : null}
                </div>
                <div className={styles.budget_list_result}>
                    <div className={styles.budget_list_result_item}>
                        <div className={styles.budget_list_result_header}>
                            Всього:
                        </div>
                        <div></div>
                        <div className={styles.budget_list_result_price}>
                            {sum}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useRef } from 'react';
import styles from './Resizeble.module.css'
const ResizableComponent = ({
    children,
    setData,
    data,
    index,
    minWidth,
    minHeight,
    parentWidth,
    parentHeight,
    setEdit
}) => {
    const [isFirstLoad, setIsFirstLoad] = useState(true); // начальная ширина
    const step = 15; // Размер шага в пикселях
    // const [width, setWidth] = useState(0); // начальная ширина
    // const [height, setHeight] = useState(0); // начальная высота
    // const [top, setTop] = useState(0); // начальная ширина
    // const [left, setLeft] = useState(0); // начальная высота
    const isResizing = useRef(false);
    const direction = useRef(null);
    const initialX = useRef(0);
    const initialY = useRef(0);

    const isMoving = useRef(false); // Флаг для перемещения элемента
    const initialMouseX = useRef(0);
    const initialMouseY = useRef(0);
    const initialLeft = useRef(0);
    const initialTop = useRef(0);


    const handleMouseDown = (e, dir) => {
        setEdit(true)
        if (dir === 'move') {
            isMoving.current = true;
            initialMouseX.current = e.clientX;
            initialMouseY.current = e.clientY;
            initialLeft.current = data[index].startLeft;
            initialTop.current = data[index].startTop;
        } else {
            isResizing.current = true;
            direction.current = dir;
            initialX.current = e.clientX;
            initialY.current = e.clientY;
        }
    };
    React.useEffect(() => {

        // console.log(data[index].startWidth)
        // window.scrollTo=null
        const  handleMouseUp = async () => {
            isResizing.current = false;
            isMoving.current = false;
            // Округляем позицию до ближайшего кратного 15
            // const newLeft = Math.round(left / 15) * 15;
            // const newTop = Math.round(top / 15) * 15;

            // setLeft(newLeft);
            // setTop(newTop);
            // Если текущая ширина равна минимальной ширине, сбросить initialX.current
            if (data[index].startWidth === (minWidth || 0)) {
                initialX.current = 0;
            }

            // Если текущая высота равна минимальной высоте, сбросить initialY.current
            if (data[index].startHeight === (minHeight || 0)) {
                initialY.current = 0;
            }


            // console.log(data)
        
        };

        const handleMouseMove = async (e) => {

            if (isResizing.current) {
                const deltaX = e.clientX - initialX.current;
                const deltaY = e.clientY - initialY.current;

                const stepX = Math.floor(deltaX / step) * step;
                const stepY = Math.floor(deltaY / step) * step;

                if (direction.current === 'top') {
                    // setHeight((prevHeight) => prevHeight - stepY);

                    setData((prevData) => {

                        const updatedData = [...prevData];
                        const itemToUpdate = { ...updatedData[index] };
                        if (itemToUpdate.startHeight - stepY >= 0 && itemToUpdate.startTop + stepY >= 15) {
                            itemToUpdate.startHeight = itemToUpdate.startHeight - stepY;
                            itemToUpdate.startTop = itemToUpdate.startTop + stepY;
                            updatedData[index] = itemToUpdate;
                        }
                        return updatedData;

                    });
                    // setTop((prevTop) => prevTop + stepY);
                } else if (direction.current === 'bottom') {
                    // setHeight((prevHeight) => prevHeight + stepY);

                    setData((prevData) => {
                        const updatedData = [...prevData];
                        updatedData[index] = {
                            ...updatedData[index],
                            startHeight: updatedData[index].startHeight + stepY,
                        };
                        return updatedData;
                    });
                } else if (direction.current === 'left') {
                    // setWidth((prevWidth) => prevWidth - stepX);
                    // setLeft((prevLeft) => prevLeft + stepX);

                    setData((prevData) => {
                        const updatedData = [...prevData];
                        if (updatedData[index].startWidth - stepX >= 0 && updatedData[index].startLeft + stepX >= 15) {
                            updatedData[index] = {
                                ...updatedData[index],
                                startWidth: updatedData[index].startWidth - stepX,
                                startLeft: updatedData[index].startLeft + stepX,
                            };
                        }

                        return updatedData;
                    });
                } else if (direction.current === 'right') {
                    // setWidth((prevWidth) => prevWidth + stepX);
                    setData((prevData) => {
                        const updatedData = [...prevData];
                        if (updatedData[index].startWidth + stepX <= parentWidth - 15) {
                            updatedData[index] = {
                                ...updatedData[index],
                                startWidth: updatedData[index].startWidth + stepX,
                            };
                        }

                        return updatedData;
                    });
                }

                initialX.current = e.clientX - (deltaX - stepX);
                initialY.current = e.clientY - (deltaY - stepY);


            } else if (isMoving.current) {
                const deltaX = e.clientX - initialMouseX.current;
                const deltaY = e.clientY - initialMouseY.current;
                console.log(data[index].startWidth)
                if (initialLeft.current + deltaX <= parentWidth - data[index].startWidth - 15 && initialLeft.current + deltaX >= 15) {
                    // setLeft(initialLeft.current + deltaX);
                    setData((prevData) => {
                        const updatedData = [...prevData];
                        updatedData[index] = {
                            ...updatedData[index],
                            startLeft: initialLeft.current + deltaX,
                        };
                        return updatedData;
                    });
                }
                if (initialTop.current + deltaY >= 15) {
                    // setTop(initialTop.current + deltaY);
                    setData((prevData) => {
                        const updatedData = [...prevData];
                        updatedData[index] = {
                            ...updatedData[index],
                            startTop: initialTop.current + deltaY,
                        };
                        return updatedData;
                    });
                }


            }
        };

        function handleCollisions(data, index, parentWidth) {
            return data.map((item, i) => {
                if (i !== index) {
                    if (
                        item.startLeft < data[index].startLeft + data[index].startWidth &&
                        item.startLeft + item.startWidth > data[index].startLeft &&
                        item.startTop < data[index].startTop + data[index].startHeight &&
                        item.startTop + item.startHeight > data[index].startTop
                    ) {
                        const horizontalDistanceLeft = Math.abs(item.startLeft - (data[index].startLeft + data[index].startWidth));
                        const horizontalDistanceRight = Math.abs((item.startLeft + item.startWidth) - data[index].startLeft);

                        const verticalDistance = Math.min(
                            Math.abs(item.startTop - (data[index].startTop + data[index].startHeight)),
                            Math.abs((item.startTop + data[index].startHeight) - data[index].startTop)
                        );

                        if (horizontalDistanceLeft <= horizontalDistanceRight) {
                            if (direction.current === 'left' && item.startLeft - item.startWidth >= 0) {
                                if (item.startLeft - item.startWidth - data[index].startLeft >= 15) {
                                    item.startLeft = data[index].startLeft - item.startWidth;
                                } else {
                                    item.startLeft = data[index].startLeft + 15; // Переместить минимум на 15 пикселей от края
                                }
                            } else if (direction.current === 'right' && item.startLeft + data[index].startWidth <= parentWidth) {
                                if (data[index].startLeft - item.startLeft >= 15) {
                                    item.startLeft = data[index].startLeft - data[index].startWidth - 15; // Переместить минимум на 15 пикселей от края
                                } else {
                                    item.startLeft = data[index].startLeft + data[index].startWidth;
                                }
                            }
                        } else {
                            if (direction.current === 'top' && item.startTop - item.startHeight >= 0) {
                                if (item.startTop - item.startHeight - data[index].startTop >= 15) {
                                    item.startTop = data[index].startTop - item.startHeight;
                                } else {
                                    item.startTop = data[index].startTop + 15; // Переместить минимум на 15 пикселей от края
                                }
                            } else {
                                item.startTop = data[index].startTop + data[index].startHeight;
                            }
                        }
                    }
                }
                return item;
            });
        }







        // Обработка столкновений только если элемент перемещается
        if(isMoving.current||isResizing.current){
            setData((prevData) => {
                const updatedData = [...prevData];
                const newData = handleCollisions(updatedData, index, parentWidth);
    
                if (JSON.stringify(newData) !== JSON.stringify(updatedData)) {
                    return newData; // Возвращаем обновленные данные только если они изменились после обработки коллизий
                } else {
                    return updatedData; // Возвращаем оригинальные данные, если нет изменений после обработки коллизий
                }
            });
        }
       
        // if(isMoving.current){
        //     setEdit(true);
        // }
        // if(isResizing.current){
        //     setEdit(true);
        // }
        // if(!isMoving.current&&!isResizing.current){
        //     setEdit(false);
        // }
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [data]);

    return (
        <div
            className={styles.resizeble_item}
            style={{
                width: data[index].startWidth,
                height: data[index].startHeight,
                position: 'absolute',
                minWidth: minWidth,
                minHeight: minHeight,
                left: data[index].startLeft,
                top: data[index].startTop,

            }}>
            <div
                className={styles.draggable}
                onMouseDown={(e) => handleMouseDown(e, 'move')}
            />
            <div
                className="resizable-top"
                style={{ width: '100%', height: '5px', position: 'absolute', top: 0, cursor: 'ns-resize',zIndex:1000 }}
                onMouseDown={(e) => handleMouseDown(e, 'top')}
            />
            <div
                className="resizable-bottom"
                style={{ width: '100%', height: '5px', position: 'absolute', bottom: 0, cursor: 'ns-resize',zIndex:1000 }}
                onMouseDown={(e) => handleMouseDown(e, 'bottom')}
            />
            <div
                className="resizable-left"
                style={{ width: '5px', height: '100%', position: 'absolute', left: 0, cursor: 'ew-resize',zIndex:1000 }}
                onMouseDown={(e) => handleMouseDown(e, 'left')}
            />
            <div
                className="resizable-right"
                style={{ width: '5px', height: '100%', position: 'absolute', right: 0, cursor: 'ew-resize',zIndex:1000 }}
                onMouseDown={(e) => handleMouseDown(e, 'right')}
            />
            <div className="content" style={{ width: '100%', height: '100%', overflow: 'auto' }}>
                {children}
            </div>
        </div>
    );
};

export default ResizableComponent;

import React, { useEffect, useRef, useState } from 'react';
import styles from './ImageTileItem.module.css';
import { ItemService } from '../../../../../../../services/item.service';
import { UserService } from '../../../../../../../services/user.service';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';

export default function ImageTileItem({ itemData, setIsUpdateTile }) {
    let { id } = useParams();
    const serverUrl = 'https://localhost:7029';
    const [image, setImage] = useState(null);
    useEffect(() => {
        const userID = Cookies.get('userID');
        if (itemData.backgroundImageId != "") {
            setImage(`${serverUrl}/avatar/${userID}/${itemData.backgroundImageId}`);
        }
        // console.log(image);
    }, [])

    const fileInputRef = useRef(null);

    const openFileInput = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        await ItemService.update_image_tile(selectedFile, itemData, id);
        setIsUpdateTile(true);
        // Вы можете отправить выбранный файл на сервер или выполнить другую необходимую логику.
    };
    if (image == null) {
        return (
            <div className={`${styles.image_tile} ${styles.default}`}>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*" // Разрешаем выбирать только изображения
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <img
                    src="http://localhost:5173/default_image.png"
                    alt="Default Image"
                    onClick={openFileInput}
                    style={{ cursor: 'pointer' }}
                />
            </div>
        );
    } else {
        return (
            <div className={`${styles.image_tile} ${styles.selected}`}>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*" // Разрешаем выбирать только изображения
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <img
                    src={image}
                    onClick={openFileInput}
                    style={{ cursor: 'pointer' }}
                />
            </div>
        )

    }

}

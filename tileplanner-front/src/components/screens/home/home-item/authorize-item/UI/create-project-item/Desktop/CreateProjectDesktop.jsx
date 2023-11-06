import React, { useEffect, useRef } from 'react'
import styles from './CreateProject.module.css'
import { useForm } from 'react-hook-form'
import { ItemService } from '../../../../../../../../services/item.service';
import { useNavigate } from 'react-router';
export default function CreateProjectDesktop({showCRPForm, setShowCRPForm}) {
    const { register, handleSubmit, reset, formState } = useForm({
        mode: 'onChange'
    })
    const navigate = useNavigate(); // Получаем функцию для навигации
    const overlay = useRef(null)
    useEffect(() => {
        const timer = setTimeout(() => {
          if (showCRPForm == false) {
            overlay.current.style.display = 'none';
          } else {
            overlay.current.style.display = 'flex';
          }
    
        //   console.log("Таймер завершен!");
        }, 100); // 3000 миллисекунд (3 секунды)
    
        // Здесь можно вернуть функцию, которая выполнится при размонтировании компонента
        return () => {
          clearTimeout(timer); // Очищаем таймер при размонтировании компонента
        };
      }, [showCRPForm]);
    const createProject= async (data) => {
        try {
            const ok = await ItemService.create_project(data);
            if (ok) {
                setShowCRPForm(false);
                navigate('/')
            }
          } catch (error) {
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
            console.error("Ошибка регистрации: ", error);
          }
    }
    const handleToggleCloseForm=()=>{
        setShowCRPForm(false)
    }
    return (
        <div ref={overlay} className={`${styles.overlay}`}>
            <form className={`${styles.project_form} animated
                     ${showCRPForm ? 'zoomInUp' : 'zoomOutDown'}`} onSubmit={handleSubmit(createProject)}>
                <div className={styles.close_profile_form_button}
                    onClick={handleToggleCloseForm}>
                    +
                </div>
                <div className={styles.create_form}>
                    <div className={styles.header}>
                        Назва проекту
                    </div>
                    <div className={styles.project_name}>
                        <input {...register('screenName', {
                            required: true,
                        })}/>
                    </div>
                    <div className={styles.create_button}>
                        <button className={styles.button}>
                            Створити
                        </button>
                    </div>
                </div>

            </form>
        </div>
    )
}

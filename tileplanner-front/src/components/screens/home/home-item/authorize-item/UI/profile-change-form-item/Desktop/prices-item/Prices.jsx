import React, { useEffect, useState } from 'react'
import styles from './Prices.module.css'

import { UserService } from '../../../../../../../../../services/user.service';
import { Link, useNavigate } from 'react-router-dom';
function Prices({ showForm,isMainPage }) {
    const [userData, setUserData] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        UserService.getOnlyUserAllFiledsState(setUserData);
        UserService.getUserRole(setUserRole);
        // console.log(userData);
        // console.log(userRole);
    }, [showForm])

    const goTo = (event) => {
        const ID = event.target.id;
        switch (ID) {
            case 'BASIC': {
                navigate('/change_plan', { state: { amount: 0, plan: 'BASIC' } })
            } break;
            case 'ADVANCED': {
                navigate('/change_plan', { state: { amount: 4, plan: 'ADVANCED' } })
            } break;
            case 'FULL': {
                navigate('/change_plan', { state: { amount: 8, plan: 'FULL' } })
            } break;
        }
    }

    if(isMainPage){
        return(<>
        
        <div className={styles.plan}>
                        <div className={styles.plan_name}>
                            Безкоштовний
                        </div>
                        <div className={styles.plan_price}>
                            <div className={styles.price}>
                                0 $
                            </div>
                            <div className={styles.length}>
                                на місяць
                            </div>
                        </div>
                        <div id='BASIC' className={`${styles.plan_change_button}  ${styles.hovered}  `} >
                        Зареєструватися
                        </div>
                        <div className={styles.abilities}>
                            <div className={styles.ability}>
                                <div className={styles.inactive}>

                                </div>
                                <div className={styles.description}>
                                    Обмеження на завантаження 500MB
                                </div>
                            </div>
                            <div className={styles.ability}>
                                <div className={styles.inactive}>

                                </div>
                                <div className={styles.description}>
                                    1000 блоків
                                </div>
                            </div>
                        </div>
                    </div>

 <div className={styles.plan}>
                        <div className={styles.plan_name}>
                            Повний
                        </div>
                        <div className={styles.plan_price}>
                            <div className={styles.price}>
                                4 $
                            </div>
                            <div className={styles.length}>
                                на місяць
                            </div>
                        </div>
                        <div id='ADVANCED' className={`${styles.plan_change_button}   ${styles.hovered}`}>    
                        Зареєструватися
                        </div>
                        <div className={styles.abilities}>
                            <div className={styles.ability}>
                                <div className={styles.active}>

                                </div>
                                <div className={styles.description}>
                                    Необмежене завантаження файлів
                                </div>
                            </div>
                            <div className={styles.ability}>
                                <div className={styles.active}>

                                </div>
                                <div className={styles.description}>
                                    Необмежена кількість блоків
                                </div>
                            </div>
                        </div>
                    </div>
 <div className={styles.plan}>
                        <div className={styles.plan_name}>
                            Преміум
                        </div>
                        <div className={styles.plan_price}>
                            <div className={styles.price}>
                                8 $
                            </div>
                            <div className={styles.length}>
                                на місяць
                            </div>
                        </div>
                        <div id='FULL' className={`${styles.plan_change_button} 
           ${styles.hovered} `}>
                                Зареєструватися
                        </div>
                        <div className={styles.abilities}>
                            <div className={styles.ability}>
                                <div className={styles.active}>

                                </div>
                                <div className={styles.description}>
                                    Необмежене завантаження файлів
                                </div>
                            </div>
                            <div className={styles.ability}>
                                <div className={styles.active}>

                                </div>
                                <div className={styles.description}>
                                    Необмежена кількість блоків
                                </div>
                            </div>
                            <div className={styles.ability}>
                                <div className={styles.active}>

                                </div>
                                <div className={styles.description}>
                                    Відслідковуй погоду
                                </div>
                            </div>
                        </div>
                    </div>
        </>)
    }
    if (userRole?.accessLevel != null) {
        return (
            <div className={styles.prices}>
                {userRole.accessLevel == 'BASIC' ?
                    <div className={styles.plan}>
                        <div className={styles.plan_name}>
                            Безкоштовний
                        </div>
                        <div className={styles.plan_price}>
                            <div className={styles.price}>
                                0 $
                            </div>
                            <div className={styles.length}>
                                на місяць
                            </div>
                        </div>
                        <div className={`${styles.plan_change_button} 
            ${styles.current}  `}>
                            Поточний план
                        </div>
                        <div className={styles.abilities}>
                            <div className={styles.ability}>
                                <div className={styles.inactive}>

                                </div>
                                <div className={styles.description}>
                                    Обмеження на завантаження 500MB
                                </div>
                            </div>
                            <div className={styles.ability}>
                                <div className={styles.inactive}>

                                </div>
                                <div className={styles.description}>
                                    1000 блоків
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className={styles.plan}>
                        <div className={styles.plan_name}>
                            Безкоштовний
                        </div>
                        <div className={styles.plan_price}>
                            <div className={styles.price}>
                                0 $
                            </div>
                            <div className={styles.length}>
                                на місяць
                            </div>
                        </div>
                        <div id='BASIC' className={`${styles.plan_change_button}  ${styles.hovered}  `} onClick={goTo}>
                            Змінити план
                        </div>
                        <div className={styles.abilities}>
                            <div className={styles.ability}>
                                <div className={styles.inactive}>

                                </div>
                                <div className={styles.description}>
                                    Обмеження на завантаження 500MB
                                </div>
                            </div>
                            <div className={styles.ability}>
                                <div className={styles.inactive}>

                                </div>
                                <div className={styles.description}>
                                    1000 блоків
                                </div>
                            </div>
                        </div>
                    </div>}

                {userRole.accessLevel == 'ADVANCED' ?
                    <div className={styles.plan}>
                        <div className={styles.plan_name}>
                            Повний
                        </div>
                        <div className={styles.plan_price}>
                            <div className={styles.price}>
                                4 $
                            </div>
                            <div className={styles.length}>
                                на місяць
                            </div>
                        </div>
                        <div className={`${styles.plan_change_button}   ${styles.current}`}>
                            Поточний план
                        </div>
                        <div className={styles.abilities}>
                            <div className={styles.ability}>
                                <div className={styles.active}>

                                </div>
                                <div className={styles.description}>
                                    Необмежене завантаження файлів
                                </div>
                            </div>
                            <div className={styles.ability}>
                                <div className={styles.active}>

                                </div>
                                <div className={styles.description}>
                                    Необмежена кількість блоків
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className={styles.plan}>
                        <div className={styles.plan_name}>
                            Повний
                        </div>
                        <div className={styles.plan_price}>
                            <div className={styles.price}>
                                4 $
                            </div>
                            <div className={styles.length}>
                                на місяць
                            </div>
                        </div>
                        <div id='ADVANCED' className={`${styles.plan_change_button}   ${styles.hovered}`} onClick={goTo}>    
                                Змінити план
                        </div>
                        <div className={styles.abilities}>
                            <div className={styles.ability}>
                                <div className={styles.active}>

                                </div>
                                <div className={styles.description}>
                                    Необмежене завантаження файлів
                                </div>
                            </div>
                            <div className={styles.ability}>
                                <div className={styles.active}>

                                </div>
                                <div className={styles.description}>
                                    Необмежена кількість блоків
                                </div>
                            </div>
                        </div>
                    </div>}

                {userRole.accessLevel == 'FULL' ?
                    <div className={styles.plan}>
                        <div className={styles.plan_name}>
                            Преміум
                        </div>
                        <div className={styles.plan_price}>
                            <div className={styles.price}>
                                8 $
                            </div>
                            <div className={styles.length}>
                                на місяць
                            </div>
                        </div>
                        <div className={`${styles.plan_change_button} 
       ${styles.current} `}>
                            Поточний план
                        </div>
                        <div className={styles.abilities}>
                            <div className={styles.ability}>
                                <div className={styles.active}>

                                </div>
                                <div className={styles.description}>
                                    Необмежене завантаження файлів
                                </div>
                            </div>
                            <div className={styles.ability}>
                                <div className={styles.active}>

                                </div>
                                <div className={styles.description}>
                                    Необмежена кількість блоків
                                </div>
                            </div>
                            <div className={styles.ability}>
                                <div className={styles.active}>

                                </div>
                                <div className={styles.description}>
                                    Відслідковуй погоду
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className={styles.plan}>
                        <div className={styles.plan_name}>
                            Преміум
                        </div>
                        <div className={styles.plan_price}>
                            <div className={styles.price}>
                                8 $
                            </div>
                            <div className={styles.length}>
                                на місяць
                            </div>
                        </div>
                        <div id='FULL' className={`${styles.plan_change_button} 
           ${styles.hovered} `} onClick={goTo}>
                                Змінити план
                        </div>
                        <div className={styles.abilities}>
                            <div className={styles.ability}>
                                <div className={styles.active}>

                                </div>
                                <div className={styles.description}>
                                    Необмежене завантаження файлів
                                </div>
                            </div>
                            <div className={styles.ability}>
                                <div className={styles.active}>

                                </div>
                                <div className={styles.description}>
                                    Необмежена кількість блоків
                                </div>
                            </div>
                            <div className={styles.ability}>
                                <div className={styles.active}>

                                </div>
                                <div className={styles.description}>
                                    Відслідковуй погоду
                                </div>
                            </div>
                        </div>
                    </div>}

            </div>
        )
    } else {
        return (<></>)
    }

}

export default Prices
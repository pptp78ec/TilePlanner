import React from 'react'
import styles from './Prices.module.css'
import { Link } from 'react-router-dom'
function Prices({ mainPage }) {
    return (
        <div className={styles.prices}>
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
                 ${styles.hovered}`}>
                   <Link to={"/registration"}>  Зареєструватися</Link> 
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
                <div className={`${styles.plan_change_button}   ${styles.hovered}`}>
                <Link to={"/registration"}>  Зареєструватися</Link> 
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
                <div className={`${styles.plan_change_button} 
       ${styles.hovered} `}>
                   <Link to={"/registration"}>  Зареєструватися</Link> 
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
        </div>
    )
}

export default Prices
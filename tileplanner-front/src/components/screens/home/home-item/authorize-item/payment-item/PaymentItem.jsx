import React, { useEffect, useState } from 'react'
import { PaymentService } from '../../../../../../services/payment.service'
import DropIn from "braintree-web-drop-in-react";
import { UserService } from '../../../../../../services/user.service';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Payment.module.css'
export default function PaymentItem() {
    const [userToken, setUserToken] = useState(null);
    const [userInstance, setUserInstance] = useState(null);
    const [userPaymentDetails, setUserPaymentDetails] = useState(null);
    const navigate=useNavigate();
    const location = useLocation();
    const amount = location.state?.amount
    const plan = location.state?.plan
//    console.log(amount)
    useEffect(() => {
        PaymentService.cookiesUpdate();
        PaymentService.getUserToken(setUserToken);
        if(amount!=null&&amount==0){
            PaymentService.setBasicPlan(navigate);
        }
    }, [])
   async function buy(){
        const { nonce } = await userInstance.requestPaymentMethod();
        let paymentModel={
            MoneyAmount: amount,
            AccessLevel: plan,
            UserID: PaymentService.getUserId(),
            PaymentMethodNonce:nonce,
        };
       await PaymentService.buy(paymentModel,setUserPaymentDetails,navigate);
    //    console.log(userPaymentDetails);
    }
    if(userToken==null){return<></>}
    return (

        <div className={styles.container}>
            <DropIn 
                options={{ authorization: userToken }}
                onInstance={(instance) => setUserInstance(instance)}
            />
            <button className={styles.button} onClick={buy}>Buy</button>
        </div>
        

    )
}
const containerStyle = {
    maxWidth: '400px', // Максимальная ширина контейнера
    margin: '0 auto',  // Центрирование по горизонтали
    padding: '20px',   // Внутренний отступ
    border: '1px solid #ccc', // Граница контейнера
    borderRadius: '5px',      // Скругление углов
    backgroundColor: '#f9f9f9', // Цвет фона
  };
  
  const buttonStyle = {
    display: 'block',        // Отображать как блочный элемент
    width: '100%',           // 100% ширины
    padding: '10px 20px',    // Внутренний отступ кнопки
    backgroundColor: '#007bff', // Цвет фона кнопки
    color: '#fff',           // Цвет текста
    border: 'none',          // Убрать границу
    borderRadius: '5px',     // Скругление углов
    cursor: 'pointer',       // Изменение курсора при наведении
    marginTop: '20px',       // Внешний отступ сверху
  };
  
import axios from 'axios'
import React from 'react'
import Cookies from 'js-cookie';
let config
let configJSON
let userID
let token
const apiGetUserToken="https://localhost:7029/generatetoken"
const apiPostCheckout="https://localhost:7029/checkout"
let apiGetSetDefaultSubscription;
export const PaymentService = {
    async getUserToken(setUserToken) {
        let response = await axios.get(apiGetUserToken, config);
        setUserToken(response.data);
    },
    async setBasicPlan(navigate){
        let response =await axios.get(apiGetSetDefaultSubscription,configJSON);
        if(response.status==200){
            navigate('/')
        }
    },
    async buy(paymentModel,setUserPaymentDetails,navigate) {
        let response =await axios.post(apiPostCheckout,paymentModel,config);
        // console.log(response);
        if(response.status==200){
            Cookies.set("token",response.data);
            setTimeout(()=>{
                navigate('/')
            },1000)
        }
        
        setUserPaymentDetails(response.data);
        
    },
    getUserId(){
        return userID;
    },
    cookiesUpdate() {
        token = Cookies.get('token');
        userID = Cookies.get('userID');
        apiGetSetDefaultSubscription = 'https://localhost:7029/setSubscriptionToBasic?userId=' + userID
        config = {
            headers: {
                Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
                'Content-Type': 'application/x-www-form-urlencoded', // Указываем тип контента, если это JSON
            }
        };
        configJSON = {
            headers: {
                Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
                'Content-Type': 'application/json', // Указываем тип контента, если это JSON
            }
        };
    }
}
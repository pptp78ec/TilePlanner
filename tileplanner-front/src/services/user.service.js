import axios from "axios"
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
const apiRegistrate = 'https://localhost:7029/register';
const apiLogin = 'https://localhost:7029/login';
export const UserService = {
    async registrate(data) {
        try {
            const response = await axios.post(apiRegistrate, data);
            console.log('Успешно отправлено:', response.data);
            // Сохраняем токен и userID в куки
            Cookies.set('token', response.data.token);
            Cookies.set('userID', response.data.userID);
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    },
    async login(data,navigate) {
        try {
            const response = await axios.post(apiLogin, data);
            console.log('Успешно отправлено:', response.data);
            // Сохраняем токен и userID в куки
            Cookies.set('token', response.data.token);
            Cookies.set('userID', response.data.userID);
            return true;
        } catch (error) {
            console.log('Ошибка при отправке данных:', error);
            navigate('/login',{ state: {errorMessage:'Invalid login or password',type:'error'} })
        }
    }
}
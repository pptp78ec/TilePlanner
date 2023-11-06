import axios from "axios"
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

let token
let userID
const serverUrl = 'https://localhost:7029';

const apiRegistrate = 'https://localhost:7029/register';
const apiLogin = 'https://localhost:7029/login';
let apiGetAllFileds
let apiGetUserRole
const apiUpdateAllFileds = 'https://localhost:7029/updateUserAllFields'
let apiUpdateAvatar
let configForMedia

let config

export const UserService = {
    async registrate(data) {
       
        try {
            const response = await axios.post(apiRegistrate, data);
            // console.log('Успешно отправлено:', response.data);
            // Сохраняем токен и userID в куки
            Cookies.set('token', response.data.token);
            Cookies.set('userID', response.data.userID);
            token = response.data.token
            userID = response.data.userID
            // console.log(token)
            return true;
        } catch (error) {
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
            console.error('Ошибка при отправке данных:', error);
            return false;
        }
    },
    async login(data, navigate) {
        try {
            const response = await axios.post(apiLogin, data);

            // console.log('Успешно отправлено:', response.data);
            // Сохраняем токен и userID в куки
            Cookies.set('token', response.data.token);
            Cookies.set('userID', response.data.userID);
            // token=response.data.token
            // userID=response.data.userID
            navigate('/')
            return true;
        } catch (error) {
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
            console.error('Ошибка при отправке данных:', error);
            navigate('/login', { state: { errorMessage: 'Invalid login or password', type: 'error' } })
            return false;
        }
    },
    async logout(navigate){
        Cookies.remove("token");
        Cookies.remove("userId");
       
    },
    async googleAuth(data, navigate) {
        let loginData = {};
        loginData.login = data.login;
        loginData.password = data.password;
        if (this.registrate(data, navigate)) {
            this.login(loginData, navigate);
        } else {

            this.login(loginData, navigate);
        }


    },
    async getUserAllFileds(setUserData, setCurrentImage) {

        try {
            const response = await axios.get(apiGetAllFileds, config);
            // console.log('Успешно отправлено:', response.data);
            let data = response.data;
            let userImage;
            if (data.isGoogle == true) {
                userImage = data?.userImageId;
            } else {
                if (data.userImageId != '') {
                    userImage = `${serverUrl}/avatar/${data?.id}/${data?.userImageId}`
                }

            }
            setCurrentImage(userImage);

            // console.log(response.data)
            setUserData(response.data);
        } catch (error) {
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
            console.log('Ошибка при отправке данных:', error);
        }
    },
    async getOnlyUserAllFileds() {

        try {
            const response = await axios.get(apiGetAllFileds, config);
            return response.data;
        } catch (error) {
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
            console.log('Ошибка при отправке данных:', error);
        }
    },
    async getOnlyUserAllFiledsState(setUserData) {

        try {
            const response = await axios.get(apiGetAllFileds, config);
            setUserData(response.data);
        } catch (error) {
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
            console.log('Ошибка при отправке данных:', error);
        }
    },
    async setUserChangedData(navigate, data, passwords) {
        try {
            data.id = userID
            const response = await axios.get(apiGetAllFileds, config);
            if (passwords.new_password != '' && response.data.password != passwords.password) {
                navigate('/', { state: { errorMessage: 'New password mismatch old', type: 'error' } })
                return;
            }
            if (!(data.userImageId instanceof FileList) && data.userImageId != '') {
                const form_data = new FormData()
                form_data.append("file", data.userImageId);
                // console.log(form_data);
                const file_response = await axios.post(apiUpdateAvatar, form_data, configForMedia)
                // console.log(file_response.data)
                data.userImageId = file_response.data;
                data.isGoogle = false;
            } else {
                data.userImageId = ''
            }
            const new_response = await axios.post(apiUpdateAllFileds, data, config)
            // console.log('Успешно отправлено:', new_response.data);
            navigate('/', { state: { errorMessage: 'Successfuly changed', type: 'succsess' } })





        } catch (error) {
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
            console.log('Ошибка при отправке данных:', error);

        }
    },
    async getUserRole(setUserRole,returnData) {
        try {
            // console.log(apiGetUserRole)
            const response = await axios.get(apiGetUserRole, config);
            if(returnData==true){
              return response.data;
            }else{
                setUserRole(response.data);
            }
           

        } catch (error) {
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
            console.log('Ошибка при отправке данных:', error);

        }
    },
    getUserId(){
        return userID;
    },
    cookiesUpdate() {
        token = Cookies.get('token');
        userID = Cookies.get('userID');
        apiGetAllFileds = 'https://localhost:7029/getuserById?id=' + userID
        apiGetUserRole = 'https://localhost:7029/geturole?userId=' + userID
        apiUpdateAvatar = 'https://localhost:7029/loadimage/' + userID
        configForMedia = {
            headers: {
                Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
                'Content-Type': 'multipart/form-data', // Указываем тип контента, если это JSON
            }
        };
        config = {
            headers: {
                Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
                'Content-Type': 'application/json', // Указываем тип контента, если это JSON
            }
        };

    }
}
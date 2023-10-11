import axios from "axios"
import Cookies from "js-cookie";
const apiCreateProject = 'https://localhost:7029/createproject';

let token
let userID
let apiGetProjects
let config

  const configForMedia = {
    headers: {
        Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
        'Content-Type': 'multipart/form-data', // Указываем тип контента, если это JSON
    }
};
export const ItemService = {
    async create_project(data) {
        try {
            const dataToSend={
                screenName:data.screenName,
                userId:userID
            }
            const response = await axios.post(apiCreateProject, dataToSend,config);
            console.log('Created project:', response.data);
            return true
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    },
    async get_projects(){
        try {
            const response = await axios.post(apiGetProjects, null, config);
            
            // console.log('Get projects:', response.data);
            return response.data;
          
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    },
    cookiesUpdate() {
         token = Cookies.get('token');
         userID = Cookies.get('userID');
         apiGetProjects = 'https://localhost:7029/getuserscreens?userId='+userID
         config = {
            headers:{
              Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
              'Content-Type': 'application/json', // Указываем тип контента, если это JSON
            }
          };
    }
}
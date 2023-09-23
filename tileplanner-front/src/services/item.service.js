import axios from "axios"
import Cookies from "js-cookie";
const apiCreateProject = 'https://localhost:7029/updateitems';

const token=Cookies.get('token');
const userID=Cookies.get('userID');
const apiGetProjects = 'https://localhost:7029/getuserscreens?userId='+userID
const config = {
    headers:{
      Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
      'Content-Type': 'application/json', // Указываем тип контента, если это JSON
    }
  };
export const ItemService = {
    async create_project(data) {
        try {
            
            const response = await axios.post(apiCreateProject, data);
            console.log('Created project:', response.data);
          
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    },
    async get_projects(){
        try {
            const response = await axios.post(apiGetProjects, null, config);
            
            console.log('Get projects:', response.data);
            return response.data;
          
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    }
}
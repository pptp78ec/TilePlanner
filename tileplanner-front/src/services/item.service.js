import axios from "axios"
import Cookies from "js-cookie";
const apiCreateProject = 'https://localhost:7029/createproject';
const apiUpdateItems = 'https://localhost:7029/updateitems';
const apiGetCoordinate = 'https://localhost:7029/getCoordinateTile';
const apiDeleteItems = 'https://localhost:7029/deleteitem';
let token
let userID
let apiGetProjects
let config
let configForMedia
export const ItemService = {
    async create_project(data) {
        try {
            const dataToSend = {
                screenName: data.screenName,
                userId: userID
            }
            const response = await axios.post(apiCreateProject, dataToSend, config);
            // console.log('Created project:', response.data);
            return true
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    },
    async get_projects() {
        try {
            const response = await axios.post(apiGetProjects, null, config);

            // console.log('Get projects:', response.data);
            return response.data;

        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    },
    async add_coordinate(coordinates, projectId) {
        if (coordinates == null) { return }
        try {
            const dataToSend = {
                Lat: String(coordinates.coordinates.lat),
                Long: String(coordinates.coordinates.lng),
                Location: coordinates.address
            }
            // console.log(dataToSend);
            const responseGet = await axios.get(`${apiGetCoordinate}?parentScreenId=${projectId}`, config);

            if (responseGet.status == "200") {
                const CoordinateTile = responseGet.data[0];
                CoordinateTile.coordinates.push(dataToSend)
                // console.log(CoordinateTile)
                const finalData = [CoordinateTile];
                // let form_data = new FormData()
                // form_data.append("items", JSON.stringify(finalData));
                // console.log(form_data)
                // console.log(finalData)
                //  const response = await axios({
                //     method: "post",
                //     url: apiAddCoordinate,
                //     headers: { "Content-Type": "multipart/form-data"},
                //     data:form_data
                // });

                const response = await axios.post(apiUpdateItems, finalData, config);
                // console.log(response)
            }

            // console.log('Created coordinate:', response.data);
            return true
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    },
    async get_coordinates(setCoordinates, projectId) {
        try {
            const response = await axios.get(`${apiGetCoordinate}?parentScreenId=${projectId}`, config);
            if (response.status == "200") {
                // console.log('Get coordinate:', response.data);
                return response.data[0];
            }

            return true
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    },
    async update_date_point(projectId, coordinateIndex, date) {
        try {
            const responseGet = await axios.get(`${apiGetCoordinate}?parentScreenId=${projectId}`, config);

            if (responseGet.status == "200") {
                const CoordinateTile = responseGet.data[0];
                CoordinateTile.coordinates[coordinateIndex].planneddate = date;
                const finalData = [CoordinateTile];
                const response = await axios.post(apiUpdateItems, finalData, config);
                return true;
            }


        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    },
    async update_isVisited_point(projectId, coordinateIndex, value) {
        try {
            const responseGet = await axios.get(`${apiGetCoordinate}?parentScreenId=${projectId}`, config);

            if (responseGet.status == "200") {
                const CoordinateTile = responseGet.data[0];
                CoordinateTile.coordinates[coordinateIndex].isvisited = value;
                const finalData = [CoordinateTile];
                const response = await axios.post(apiUpdateItems, finalData, config);
                return true;
            }


        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    },
    async remove_all_coordinates(projectId) {
        try {
            const responseGet = await axios.get(`${apiGetCoordinate}?parentScreenId=${projectId}`, config);

            if (responseGet.status == "200") {
                const CoordinateTile = responseGet.data[0];
                CoordinateTile.coordinates = [];
                const finalData = [CoordinateTile];
                const response = await axios.post(apiUpdateItems, finalData, config);
                return true;
            }

        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    },
    async delete_item(itemId) {
        try {
            const response = await axios.delete(`${apiDeleteItems}?itemId=${itemId}`, config);
            // console.log(response)

        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    },
    cookiesUpdate() {
        token = Cookies.get('token');
        userID = Cookies.get('userID');
        apiGetProjects = 'https://localhost:7029/getuserscreens?userId=' + userID
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
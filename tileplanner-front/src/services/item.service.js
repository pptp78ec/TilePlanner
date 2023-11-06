import axios from "axios"
import Cookies from "js-cookie";
const apiCreateProject = 'https://localhost:7029/createproject';
const apiUpdateItems = 'https://localhost:7029/updateitems';
const apiGetCoordinate = 'https://localhost:7029/getCoordinateTile';
const apiDeleteItems = 'https://localhost:7029/deleteitem';
const apiGetAllTiles = 'https://localhost:7029/getTilesForScreen';
const apiGetAllTilesAndRecords = 'https://localhost:7029/gettilesAndRecords';
let token
let userID
let apiGetProjects
let apiLoadImage
let config
let configForMedia
let inProcessDelete = false
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
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
            console.error('Ошибка при отправке данных:', error);
        }
    },
    async get_projects() {
        try {
            const response = await axios.post(apiGetProjects, null, config);

            // console.log('Get projects:', response.data);
            return response.data;

        } catch (error) {
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
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
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
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
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
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
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
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
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
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
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
            console.error('Ошибка при отправке данных:', error);
        }
    },
    async delete_item(itemId) {
        try {
            inProcessDelete = true;
            const response = await axios.delete(`${apiDeleteItems}?itemId=${itemId}`, config);
            // console.log(response)
            inProcessDelete = false;

        } catch (error) {
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
            console.error('Ошибка при отправке данных:', error);
        }
    },
    async get_all_tiles_by_projectId(projectId) {
        try {
            const response = await axios.get(`${apiGetAllTiles}?parentScreenId=${projectId}`, config);
            return response.data;

        } catch (error) {
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
            console.error('Ошибка при отправке данных:', error);
        }
    },
    async get_all_tiles_and_records_by_projectId(projectId) {
        try {
            const response = await axios.get(`${apiGetAllTilesAndRecords}?parentTileId=${projectId}`, config);
            return response.data;

        } catch (error) {
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
            console.error('Ошибка при отправке данных:', error);
        }
    },
    async update_tiles(data, projectId) {
        try {
            if (!inProcessDelete) {
                const response = await axios.post(`${apiUpdateItems}?parentScreenId=${projectId}`, data, config);
            }

        } catch (error) {
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
            console.error('Ошибка при отправке данных:', error);
        }
    },
    async create_tile(data, projectId, tileType) {
        try {
            const imageTileData = [
                {
                  itemtype: tileType,
                  parentId: projectId,
                  creatorId: userID,
                  tileSizeX: tileType == 'TASKLIST' ? 300 : 200,
                  tileSizeY: tileType == 'TASKLIST' ? 300 : 200,
                  tilePosX: data.left,
                  tilePosY: data.top,
                  header: tileType == 'TASKLIST' ? 'Список завданнь' :
                    tileType == 'TASK' ? 'Завдання' : tileType == 'BUDGET' ? 'Бюджет' : "",
                  budgetItems: tileType == "BUDGET" ? [
                    {
                      purpose: "",
                      place: "",
                      price: 0
                    },
                    {
                      purpose: "",
                      place: "",
                      price: 0
                    },
                    {
                      purpose: "",
                      place: "",
                      price: 0
                    }
                  ] : null, // По умолчанию, если не BUDGET, budgetItems будет null
                },
              ];
            const response = await axios.post(`${apiUpdateItems}?parentScreenId=${projectId}`, imageTileData, config);
            //    console.log(response);

        } catch (error) {
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
            console.error('Ошибка при отправке данных:', error);
        }
    },
    async create_image_tile(data, projectId) {
        // console.log(config)
        try {
            const imageTileData = [{
                itemtype: 'IMAGE',
                parentId: projectId,
                creatorId: userID,
                tileSizeX: 200,
                tileSizeY: 200,
                tilePosX: data.left,
                tilePosY: data.top
            }]
            const response = await axios.post(`${apiUpdateItems}?parentScreenId=${projectId}`, imageTileData, config);
            //    console.log(response);

        } catch (error) {
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
            console.error('Ошибка при отправке данных:', error);
        }
    },
    async update_image_tile(image, tile, projectId) {
        try {
            const form_data = new FormData()
            form_data.append("file", image);
            // console.log(form_data);
            const file_response = await axios.post(apiLoadImage, form_data, configForMedia)
            tile.backgroundImageId = file_response.data;
            const final_data = [tile]
            const response = await axios.post(`${apiUpdateItems}?parentScreenId=${projectId}`, final_data, config);

        } catch (error) {
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
            console.log('Ошибка при отправке данных:', error);

        }
    },
    async create_notes_tile(data, projectId) {
        try {
            const imageTileData = [{
                itemtype: 'NOTES',
                parentId: projectId,
                creatorId: userID,
                tileSizeX: 200,
                tileSizeY: 200,
                tilePosX: data.left,
                tilePosY: data.top
            }]
            const response = await axios.post(`${apiUpdateItems}?parentScreenId=${projectId}`, imageTileData, config);
            //    console.log(response);

        } catch (error) {
            if(import.meta.env.VITE_APP_ISSHOW_LOGS=="false"){ return; }
            console.error('Ошибка при отправке данных:', error);
        }
    },
    getIsDeleteWork() {
        return inProcessDelete;
    },
    cookiesUpdate() {
        token = Cookies.get('token');
        userID = Cookies.get('userID');
        apiGetProjects = 'https://localhost:7029/getuserscreens?userId=' + userID
        apiLoadImage = 'https://localhost:7029/loadimage/' + userID
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
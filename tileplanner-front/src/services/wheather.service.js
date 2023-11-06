import axios from "axios"
import Cookies from 'js-cookie';

export const WheatherService = {
    async get_wheather_5days_by_coordinates(lat, lng) {
        const api = {
            key: import.meta.env.VITE_APP_OPENWHEATER_API_KEY,
            base: "http://api.openweathermap.org/data/2.5/"
        }
        const response = await axios.get(`${api.base}forecast?lat=${lat}&lon=${lng}&units=metric&APPID=${api.key}&lang=ua`)
        // console.log(response)
        return response.data;
    },
    async get_wheather_current_by_coordinates(lat, lng) {
        const api = {
            key: import.meta.env.VITE_APP_OPENWHEATER_API_KEY,
            base: "http://api.openweathermap.org/data/2.5/"
        }
        const response = await axios.get(`${api.base}weather?lat=${lat}&lon=${lng}&units=metric&APPID=${api.key}&lang=ua`)
        // console.log(response)
        return response.data;
    },
    getUniqueFormattedDates(dates) {
        // Функция для форматирования даты в виде "дд-мм"
        function formatDate(inputDate) {
            const date = new Date(inputDate);
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            return `${day}.${month}`;
        }

        // Применяем функцию к каждой дате в массиве и используем Set для удаления дубликатов
        const formattedDates = Array.from(new Set(dates.map((date) => formatDate(date))));

        return formattedDates;
    },
    areDatesEqual(current, selected) {
        // Разбиваем даты на компоненты (день и месяц)
        const components1 = current.split('.');
        const components2 = selected.split('.');

        // Сравниваем день и месяц
        return components1[0] === components2[0] && components1[1] === components2[1];
    },
    areDatesEqualFor5days(current, selected) {
        const dateComponents1 = current.split(" ")[0].split("-");
        const dateComponents2 = selected.split(".");

        // Преобразуем обе даты в объекты Date (год и время будут игнорироваться)
        const parsedDate1 = new Date(0, parseInt(dateComponents1[1]) - 1, parseInt(dateComponents1[2]));
        const parsedDate2 = new Date(0, parseInt(dateComponents2[1]) - 1, parseInt(dateComponents2[0]));

        // Сравниваем полученные объекты Date
        return parsedDate1.getTime() === parsedDate2.getTime();
    },
    areTimesEqual(current, selected) {
        const timeComponents1 = current.split(" ")[1].split(":");
        const timeComponents2 = selected.split(":");

        // Извлекаем часы и минуты и сравниваем их
        const hours1 = parseInt(timeComponents1[0]);
        const minutes1 = parseInt(timeComponents1[1]);
        const hours2 = parseInt(timeComponents2[0]);
        const minutes2 = parseInt(timeComponents2[1]);

        return hours1 === hours2 && minutes1 === minutes2;
    },
    convertDateToHourAndMinutes(date) {
        const dateTimeString = date;
        const [datePart, timePart] = dateTimeString.split(" ");
        const [hour, minutes] = timePart.split(":");
        const timeObject = { hour, minutes };

        return timeObject;
    },
    convertDate(dateString) {
        const parts = dateString.split('.');
        if (parts.length === 3) {
            return `${parts[0]}.${parts[1]}`;
        }
        return dateString; // Если формат не соответствует "дд.мм.гггг", возвращаем исходную строку
    }

}
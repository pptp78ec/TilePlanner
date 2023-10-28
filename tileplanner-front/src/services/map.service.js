import axios from 'axios'
import { ItemService } from './item.service';
const apiKeyGoogle = 'AIzaSyB2zarRavKevfk14UHTE32duLrqmVgyOr4';
export const MapService = {
    async getCoordinatesByAddress(address, setCoordinates, shortAddress) {
        if (address != null) {
            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json',
                {
                    params: {
                        address: address,
                        key: apiKeyGoogle
                    }
                })
            if (response.data.status == "OK") {
                // console.log(response.data.results);
                setCoordinates({ coordinates: response.data.results[0].geometry.location, address: shortAddress })
            }

        }

    }
   
}
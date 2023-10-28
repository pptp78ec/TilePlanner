import React, { useEffect, useState } from 'react'
import styles from './CreatePoint.module.css'
import { useForm } from 'react-hook-form'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { MapService } from '../../../../../../../../services/map.service';
import { ItemService } from '../../../../../../../../services/item.service';


const apiKey = import.meta.env.VITE_APP_GMAP_API_KEY;
export default function CreatePointItem({ setCreateIsActive,setNewCoordinateActive }) {
    // const { register, handleSubmit, reset, formState } = useForm({
    //     mode: 'onChange'
    // })
    const [coordinates, setCoordinates] = useState(null);
    const [value, setValue] = useState();
    useEffect(() => {
        if (coordinates != null) {
            // alert(`Lat: ${coordinates.coordinates.lat}\nLng: ${coordinates.coordinates.lng}\nAddress:${coordinates.address}`)
            // console.log(coordinates);        
            setNewCoordinateActive(coordinates);
            setCoordinates(null);
            setCreateIsActive(false);
        }
    }, [coordinates])
    const onChange = async (data) => {
        // console.log(data);
        await MapService.getCoordinatesByAddress(data.label, setCoordinates,data.value.structured_formatting.main_text);
       


            // console.log(`${coordinates} ${data.label}`);
            // ItemService.add_coordinate(coordinates,data.label);
          
        


    }

    return (
        <>
            <GooglePlacesAutocomplete
                apiKey={apiKey}
                selectProps={{
                    value,
                    onChange: onChange
                }}>

            </GooglePlacesAutocomplete>
            {/* <form onSubmit={handleSubmit(createPoint)}>
                <div className={styles.createForm} onClick={() => { setCreateIsActive(false) }}>
                    <div className={styles.inputForCreate}>
                        <input type="text" />
                    </div>
                    <div className={styles.inputSubmit}>
                        <input type="submit" />
                    </div>
                </div>
            </form> */}

        </>

    )
}

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import styles from './Map.module.css'
import './Map.css';
import './leaflet.css'
import { MapService } from '../../../../../../../services/map.service';
import { WheatherService } from '../../../../../../../services/wheather.service';
import { UserService } from '../../../../../../../services/user.service';
import { Link } from 'react-router-dom';
export default function MapItem({ coordinates, setSelectedIndexPoint, isUpdatedCoordinates }) {
  const [bounds, setBounds] = useState(null);
  const [markers, setMarkers] = useState(null);
  const [weather, setWeather] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [selectedWeatherDate, setSelectedWeatherDate] = useState(WheatherService.convertDate(new Date().toLocaleDateString()));

  useEffect(() => {
    const fetchData = async () => {
      UserService.cookiesUpdate();
      const result = await UserService.getUserRole(setUserRole, true);
      const userPlan = result.accessLevel;
      if (userPlan == "FULL") {
        setUserRole(userPlan);
        const weatherBuffer = [];
        const uniqueCoordinates = new Set();
        // console.log(coordinates)
        for (let i = 0; i < coordinates.coordinates.length; i++) {
          const coordinate = coordinates.coordinates[i];
          const coordinateString = `${coordinate.lat}-${coordinate.long}`;

          if (!uniqueCoordinates.has(coordinateString)) {
            uniqueCoordinates.add(coordinateString);
            const currentWeather = await WheatherService.get_wheather_current_by_coordinates(coordinate.lat, coordinate.long);
            const fiveDaysWeather = await WheatherService.get_wheather_5days_by_coordinates(coordinate.lat, coordinate.long);
            weatherBuffer.push(
              {
                index: i,
                currentWeather: currentWeather,
                fiveDaysWeather: fiveDaysWeather

              }
            )
          }
        }
        setWeather(weatherBuffer);
        if (coordinates?.coordinates != undefined && coordinates?.coordinates.length != 0) {
          const markers1 = coordinates?.coordinates.map((item) => [item.lat, item.long]);
          let bounds = null;
          // console.log(markers1);
          if (markers1 != null) {
            bounds = L.latLngBounds(markers1);
          }
          // Если у вас нет маркеров, не устанавливайте масштаб

          setBounds(bounds)
          // console.log(bounds);
          setMarkers(markers1);

        }
      } else {
        if (coordinates?.coordinates != undefined && coordinates?.coordinates.length != 0) {
          const markers1 = coordinates?.coordinates.map((item) => [item.lat, item.long]);
          let bounds = null;
          // console.log(markers1);
          if (markers1 != null) {
            bounds = L.latLngBounds(markers1);
          }
          // Если у вас нет маркеров, не устанавливайте масштаб

          setBounds(bounds)
          // console.log(bounds);
          setMarkers(markers1);

        }
      }


    }


    fetchData()
  }, [coordinates]);

  const handleDateChange = (event) => {
    setSelectedWeatherDate(event.target.value);
    // console.log(event.target.value);
  };
  // console.log(coordinates);

  if (coordinates?.coordinates != undefined && coordinates?.coordinates.length != 0 && bounds != null) {
    const handleSelectedPoint = (index) => {
      setSelectedIndexPoint(index)
    }
    const handlePopUpClose = () => {
      setSelectedIndexPoint(null)
    }

    return (
      <MapContainer style={containerStyle} center={bounds.getCenter()} bounds={markers} >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=rNQyAplhCuIZEvs5NaWW"
        />
        {userRole == "FULL" ?
          markers && weather ?
            markers.map((position, index) => {
              // console.log(weather[index]);
              // if(!weather[index].fiveDaysWeather&&weather[index].currentWeather){return ""}
              // console.log(weather[index].fiveDaysWeather);
              let temp = null;
              let indexInList = 0;
              let currentDate = false;
              let hourlyWeather = [];
              weather[index]?.fiveDaysWeather?.list.map((item, index) => {
                if (WheatherService.areDatesEqualFor5days(item.dt_txt, selectedWeatherDate)) {
                  hourlyWeather.push(item);
                }
              });
              // console.log(hourlyWeather);
              if (WheatherService.areDatesEqual(new Date().toLocaleDateString(), selectedWeatherDate)) {
                temp = String(weather[index].currentWeather.main.temp).split('.')[0];
                currentDate = true;
              } else {
                let tempBuffer;
                weather[index].fiveDaysWeather.list.map((item, index) => {
                  if (WheatherService.areDatesEqualFor5days(item.dt_txt, selectedWeatherDate)) {
                    if (WheatherService.areTimesEqual(item.dt_txt, "15:00")) {
                      temp = String(item.main.temp).split('.')[0];
                    } else {
                      tempBuffer = String(item.main.temp).split('.')[0];
                    }
                    indexInList = index;
                  }
                })
                if (temp == null) {
                  temp = tempBuffer;
                }
              }
              const input_dates = [];
              weather[index].fiveDaysWeather.list.map((item, index) => {
                input_dates.push(item.dt_txt);
              })

              const formated_dates = WheatherService.getUniqueFormattedDates(input_dates);
              // console.log(weather[index].currentWeather.weather);
              if (temp == null) {
                temp = weather[index].currentWeather.main.temp;
              }
              const customIcon = new L.Icon({
                iconUrl: `http://localhost:5173/weather_icons/point_icons/${weather[index].currentWeather.weather[0].icon}.svg`, // URL вашей иконки
                iconSize: [35, 40.5], // Размер иконки
                iconAnchor: [20, 40], // Положение "якоря" иконки (середина снизу)
              });

              return (
                <Marker
                  key={index}
                  position={position}
                  icon={customIcon}
                  eventHandlers={{ click: () => { handleSelectedPoint(index) } }}
                >
                  <Popup maxWidth={403} closeOnEscapeKey={handlePopUpClose} closeOnClick={handlePopUpClose}>
                    <div className={styles.weather_form}>
                      <div className={styles.current_weather}>
                        <div className={styles.current_weather_temp}>
                          {temp}&#176;
                        </div>
                        <div className={styles.current_weather_icon}>
                          {currentDate ? <img style={{ width: `40px`, height: `40px` }}
                            src={`http://localhost:5173/weather_icons/open_icons/${weather[index].currentWeather.weather[0].icon}.svg`} />
                            :
                            <img style={{ width: `40px`, height: `40px` }}
                              src={`http://localhost:5173/weather_icons/open_icons/${weather[index].fiveDaysWeather.list[indexInList].weather[0].icon}.svg`} />
                          }

                        </div>
                        <div className={styles.current_weather_desc}>
                          {currentDate ? weather[index].currentWeather.weather[0].description
                            :
                            weather[index].fiveDaysWeather.list[indexInList].weather[0].description
                          }

                        </div>
                        <div className={styles.current_weather_date}>
                          <select value={selectedWeatherDate} onChange={handleDateChange}>
                            {formated_dates.map((item, index) => {
                              return (
                                <option key={index} value={item}>{item}</option>
                              )
                            })}
                            {/* Добавьте другие даты как необходимо */}
                          </select>
                        </div>
                      </div>
                      <div className={styles.current_weather_hourly}>
                        {hourlyWeather.map((item, index) => {
                          let timeObject = WheatherService.convertDateToHourAndMinutes(item.dt_txt);
                          let temp = String(item.main.temp).split('.')[0];
                          return (
                            <div key={index} className={styles.weather_hourly}>
                              <div className={styles.weather_time}>
                                <div className={styles.hour}>
                                  {timeObject.hour}
                                </div>
                                <div className={styles.minutes}>
                                  {timeObject.minutes}
                                </div>
                              </div>
                              <div className={styles.weather_icon}>
                                <img style={{ width: `30px`, height: `30px` }}
                                  src={`http://localhost:5173/weather_icons/open_icons/${item.weather[0].icon}.svg`} />
                              </div>
                              <div className={styles.weather_temp}>
                                {temp}&#176;
                              </div>
                            </div>

                          )
                        })}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
            })
            : ""

          : markers ?
            markers.map((position, index) => {
              const customIcon = new L.Icon({
                iconUrl: `http://localhost:5173/weather_icons/point_icons/default_icon.svg`, // URL вашей иконки
                iconSize: [35, 40.5], // Размер иконки
                iconAnchor: [20, 40], // Положение "якоря" иконки (середина снизу)
              });

              return (
                <Marker key={index}
                  position={position}
                  icon={customIcon}
                  eventHandlers={{ click: () => { handleSelectedPoint(index) } }}
                >
                  <Popup maxWidth={403} closeOnEscapeKey={() => { setSelectedIndexPoint(null) }} closeOnClick={() => { setSelectedIndexPoint(null) }}>
                    <div className={styles.plan_message}>
                      <div>Тут повинна бути погода.</div>
                      <div> Перегляньте свій <Link to={'/'}>план</Link> у профілі</div>
                    </div>
                  </Popup>
                </Marker>
              )
            })
            : ""}


      </MapContainer>
    )
  } else {
    return (
      <MapContainer style={containerStyle} zoom={2} center={{ lat: 51.5078788, lng: -0.0877321 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=rNQyAplhCuIZEvs5NaWW"
        />

      </MapContainer>
    )
  }

}
const containerStyle = {
  width: '80%',
  heigth: '100%'
};
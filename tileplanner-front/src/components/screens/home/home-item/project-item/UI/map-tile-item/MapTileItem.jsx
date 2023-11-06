import React, { useEffect, useState } from 'react'
import styles from './MapTile.module.css'
import Calendar from 'react-calendar';
import '../../../../../../../Calendar.css'
import CreatePointItem from './UI/CreatePointItem';
import { ItemService } from '../../../../../../../services/item.service';
import { useParams } from 'react-router-dom';
export default function MapTileItem({ data, setData, coordinates, setIsUpdateCoordinates, selectedPointIndex }) {
  const [isChecked, setIsChecked] = useState(false);
  const [createIsActive, setCreateIsActive] = useState(false);
  const [calendarActivity, setCalendarActivity] = useState([]);
  const [newCoordinateActive, setNewCoordinateActive] = useState(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  let { id } = useParams();
  const handleCheckboxChange = async (event) => {
    const dateId = event.currentTarget.getAttribute('dateId');
    const isChecked = event.target.checked;

    await ItemService.update_isVisited_point(id, dateId, isChecked);
    setIsUpdateCoordinates(true);
  };
  // window.scrollTo(0, 0);
  useEffect(() => {
    // console.log(coordinates);
    if (coordinates?.coordinates) {
      let cald = [];
      coordinates.coordinates.map((item, index) => {
        cald.push({ id: index, active: false });
      })
      setCalendarActivity(cald);
    }
    const updateData = async () => {

      await ItemService.add_coordinate(newCoordinateActive, id)
      setNewCoordinateActive(null);
      setIsUpdateCoordinates(true);

    }
    if (newCoordinateActive != null) {
      updateData();

    }

  }, [coordinates, newCoordinateActive])

  const handleCalendarIconClick = (event) => {
    const id = event.target.id;
    // console.log(id);
    if (id != null) {
      setCalendarActivity((prevCalendarActivity) =>
        prevCalendarActivity.map((item) => {
          // console.log(item);
          if (item.id == id) {
            return { ...item, active: !item.active };
          }
          return item;
        })
      );
    }
  };
  const handleCalendarChange = async (itemId, newData) => {
    // В этой функции вы можете использовать dataId и newValue
    // console.log(`Calendar with data-id ${itemId} changed to ${newData.toLocaleString()}`);
    await ItemService.update_date_point(id, itemId, newData);
    setIsUpdateCoordinates(true);
    let event = { target: { id: itemId } };
    handleCalendarIconClick(event);
  };
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  const handleRemovePoints=async()=>{
   await ItemService.remove_all_coordinates(id);
   setIsUpdateCoordinates(true);
  }
  return (
    <div className={styles.toDo_map}>
      <div className={styles.toDo_header}>
        <div className={styles.header_text}>
          Локація
        </div>
        <div className={styles.header_submenu} onClick={toggleMenu}>
          . . .
          {isMenuOpen && (
            <div className={styles.sub_menu}>
              <div className={styles.sub_element} onClick={handleRemovePoints}>
                Очистити
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.toDo_list}>
        {coordinates?.coordinates ? coordinates.coordinates.map((item, index) => {
          // console.log(item.isVisited)
          //  console.log(calendarActivity);
          return (
            <div key={index} className={item.isVisited ? `${styles.toDo_item} ${styles.isVisited}` : `${styles.toDo_item} ${styles.isNotVisited}`}>
              <div className={styles.item_checkbox}>
                <label className={styles.custom_checkbox} >
                  <input checked={item.isVisited ? true : false} type="checkbox" dateId={index} onClick={handleCheckboxChange} />
                  <span className={styles.checkmark}></span>
                </label>
              </div>
              {selectedPointIndex == index ?
                <div className={`${styles.item_address} ${styles.selected_address}`}>{item.location}</div>
                :
                <div className={styles.item_address}>{item.location}</div>
              }

              <div className={styles.calendar_icon} id={index} onClick={handleCalendarIconClick}></div>
              {calendarActivity[index]?.active ? <div className={`${styles.item_calendar} animated`}><Calendar onChange={(newDate) => handleCalendarChange(index, newDate)} defaultValue={item.plannedDate ? new Date(item.plannedDate) : new Date()} /></div> : ""}
            </div>
          )
        }) : ""}
        {createIsActive ? <CreatePointItem setNewCoordinateActive={setNewCoordinateActive} setCreateIsActive={setCreateIsActive} /> : ""}
        <div className={styles.toDo_create} onClick={() => { setCreateIsActive(true) }}>
          +
        </div>
      </div>
    </div>
  )
}

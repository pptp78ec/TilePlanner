import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Project.module.css'
import MapItem from '../UI/map-item/MapItem';
import MapTileItem from '../UI/map-tile-item/MapTileItem';
import ToDoItem from '../UI/todotile-item/ToDoItem';
import { ItemService } from '../../../../../../services/item.service';
import { WheatherService } from '../../../../../../services/wheather.service';
export default function ProjectItemDesktop() {

  const [isUpdateCoordinates, setIsUpdateCoordinates] = useState({});
  const [coordinates, setCoordinates] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [alreadyGetProjects, setAlreadyGetProjects] = useState(false);
  const [projectsData, setProjectsData] = useState([]);
  const [selectedPointIndex, setSelectedPointIndex] = useState(null);
  const navigate = useNavigate();
  let { id } = useParams();
  function gotTo(event) {
    const projectId = event.target.id;
    if (projectId != null) {
      navigate('/project/' + projectId);
      window.location.reload();
    }

  }
  useEffect(() => {
   
    // WheatherService.get_wheather_current_by_coordinates(52.4006235,16.7368566);
    if (isFirstLoad) {
      setCoordinates(null);
      setIsFirstLoad(false)
    }
    const fetchData = async () => {
      // console.log("PROJECT_ITEM")
      if (isUpdateCoordinates != null) {
        const data = await ItemService.get_coordinates(setCoordinates, id);
        setCoordinates(data);
        const wetherBuffer={};
        setIsUpdateCoordinates(null);
      }
      if (!alreadyGetProjects) {
        // console.log("OK")
        ItemService.cookiesUpdate();
        const projectData = await ItemService.get_projects();
        setProjectsData(projectData);
        // console.log(projectData)
        setAlreadyGetProjects(true);
      }
      
      // console.log(coordinates);
    }
    fetchData();

  }, [alreadyGetProjects, isFirstLoad, isUpdateCoordinates])
  if (isUpdateCoordinates == null) {
    return (
      <>
        <div className={styles.main}>
          <div className={styles.content}>
            <div className={styles.projects}>
              {projectsData?.map((item, index) => {


                return (
                  <>
                    {item.id == id ? <div key={index} id={item.id} className={`${styles.active}`}>
                      {item.header}
                    </div> :
                      <div key={index} id={item.id} className={styles.project} onClick={gotTo}>
                        {item.header}
                      </div>
                    }

                  </>

                )
              })}
              <div className={styles.create_project}>+</div>
              <div className={styles.horizontal_line}></div>
            </div>
            <div className={styles.workspace}>
              <div className={styles.map_container}>
                <MapItem isUpdatedCoordinates={isUpdateCoordinates} coordinates={coordinates} setSelectedIndexPoint={setSelectedPointIndex} />
                <MapTileItem selectedPointIndex={selectedPointIndex} coordinates={coordinates} setIsUpdateCoordinates={setIsUpdateCoordinates} />
              </div>
              <div className={styles.tiles_container}>
                {/* <ToDoItem/> */}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className={styles.main}>
          <div className={styles.content}>
            <div className={styles.projects}>
              <div className={styles.create_project}>+</div>
              <div className={styles.horizontal_line}></div>
            </div>
            <div className={styles.workspace}>
              <div className={styles.map_container}>
                <MapItem coordinates={coordinates} />
                <MapTileItem coordinates={coordinates} setIsUpdateCoordinates={setIsUpdateCoordinates} />
              </div>
              <div className={styles.tiles_container}>
                {/* <ToDoItem/> */}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

}

import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Project.module.css'
import MapItem from '../UI/map-item/MapItem';
import MapTileItem from '../UI/map-tile-item/MapTileItem';
import ToDoItem from '../UI/todotile-item/ToDoItem';
import { ItemService } from '../../../../../../services/item.service';
import { WheatherService } from '../../../../../../services/wheather.service';
import ResizableComponent from '../UI/resizable-component-item/ResizableComponentItem';
import Draggable from 'react-draggable';
import ContextMenu from '../UI/create-tile-menu/CreateTileMenu';
import DefaultItem from '../UI/default-item/DefaultItem';
export default function ProjectItemDesktop() {
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ left: 0, top: 0 });

  const [isWaitUpdate, setIsWaitUpdate] = useState(false);
  const [isUpdateCoordinates, setIsUpdateCoordinates] = useState({});
  const [isUpdateTiles, setIsUpdateTiles] = useState({});
  const [coordinates, setCoordinates] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [alreadyGetProjects, setAlreadyGetProjects] = useState(false);
  const [projectsData, setProjectsData] = useState([]);
  const [selectedPointIndex, setSelectedPointIndex] = useState(null);
  const [tilesContainerWidth, setTilesContainerWidth] = useState(null);
  const [tilesContainerHeight, setTilesContainerHeight] = useState(null);
  const [isEditTiles, setIsEditTiles] = useState(null);
  const [tilesData, setTilesData] = useState();
  const [tiles, setTiles] = useState();
  const navigate = useNavigate();
  let { id } = useParams();
  function gotTo(event) {
    const projectId = event.target.id;
    if (projectId != null) {
      navigate('/project/' + projectId);
      window.location.reload();
    }

  }
  const handleWindowResize = () => {
    const element = document.getElementsByClassName(styles.tiles_container);

    const width = element[0].scrollWidth;
    const height = element[0].scrollHeight;
    console.log(width + '/' + height)
    setTilesContainerHeight(height);
    setTilesContainerWidth(width);
  }

  useEffect(() => {
    if (!isWaitUpdate) {
      setIsWaitUpdate(true);
      setTimeout(() => {

        // console.log(tilesData)
        if (tiles == undefined) { setIsWaitUpdate(false); return }
        // setIsUpdateTiles(true);
        let newUpdateTiles = tilesData.map((item, index) => {
          return { ...item };
        });

        tiles.map((item, index) => {
          newUpdateTiles[index].tileSizeX = item.startWidth;
          newUpdateTiles[index].tileSizeY = item.startHeight;
          newUpdateTiles[index].tilePosX = item.startLeft;
          newUpdateTiles[index].tilePosY = item.startTop;
        })
        ItemService.update_tiles(newUpdateTiles, id)
        newUpdateTiles = null;
        setIsWaitUpdate(false);
      }, 1);
    }

  }, [tilesData,isWaitUpdate])
  useEffect(() => {
    ItemService.cookiesUpdate();
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
        const wetherBuffer = {};
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
      if (isUpdateTiles != null) {
        console.log("GETTILES")
        const data = await ItemService.get_all_tiles_by_projectId(id);

        const convertedData = data.map((item, index) => {
          return {
            id: index,  // Присваиваем уникальный идентификатор (можно использовать другую логику)
            startTop: item.tilePosY,  // Используем tilePosY как startTop
            startLeft: item.tilePosX,  // Используем tilePosX как startLeft
            startWidth: item.tileSizeX,  // Используем tileSizeX как startWidth
            startHeight: item.tileSizeY,  // Используем tileSizeY как startHeight
          };
        });
        setTiles(convertedData);
        setTilesData(data);
        setIsUpdateTiles(null);
      }

      // console.log(coordinates);
    }
    fetchData();
    // Добавьте события `resize` и `load` к `window`
    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('load', handleWindowResize);

    return () => {
      // Удалите события `resize` и `load` с `window`
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('load', handleWindowResize);
    };
  }, [tilesContainerHeight, tilesContainerWidth, alreadyGetProjects, isFirstLoad, isUpdateCoordinates, isUpdateTiles])

  const handleContainerDoubleClick = (e) => {
    console.log("OK")
    e.preventDefault();
    const container = document.querySelector(`.${styles.tiles_container}`);
    if (container) {
      const boundingBox = container.getBoundingClientRect();
      const left = e.clientX - boundingBox.left;
      const top = e.clientY - boundingBox.top;
      setContextMenuPosition({ left, top });
      setIsContextMenuVisible(true);
    }
    // Обработка выбора пункта меню и координаты нажатия

  };
  async function updateData() {
    const data = await ItemService.get_all_tiles_by_projectId(id);
    const convertedData = data.map((item, index) => {
      return {
        id: index,  // Присваиваем уникальный идентификатор (можно использовать другую логику)
        startTop: item.tilePosY,  // Используем tilePosY как startTop
        startLeft: item.tilePosX,  // Используем tilePosX как startLeft
        startWidth: item.tileSizeX,  // Используем tileSizeX как startWidth
        startHeight: item.tileSizeY,  // Используем tileSizeY как startHeight
      };
    });
    setTiles(convertedData);
    setTilesData(data);
    setIsUpdateTiles(null);
  }
  const handleMenuItemClick = async (menuItem, clickPosition) => {
    // console.log(`Clicked on ${menuItem} at (${clickPosition.left}, ${clickPosition.top})`);
    switch (menuItem) {
      case 'image': await ItemService.create_image_tile(clickPosition, id); break;
      case 'notes': await ItemService.create_notes_tile(clickPosition, id); break;
    }
    setIsContextMenuVisible(false);
    setIsUpdateTiles({});
    updateData();

  }
  if (isUpdateCoordinates == null && isUpdateTiles == null) {
    return (
      <>
        <div className={styles.main} style={isEditTiles ? { userSelect: 'none' } : {}} >
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
              <div
                className={styles.tiles_container}
                onDoubleClick={handleContainerDoubleClick}
              >

                {tiles.map((item, index) => {
                  return (
                    <ResizableComponent key={index}
                      parentHeight={tilesContainerHeight}
                      parentWidth={tilesContainerWidth}
                      data={tiles}
                      setData={setTiles}
                      index={index}
                      minHeight={200}
                      minWidth={200}
                      setEdit={setIsEditTiles}
                    >
                      <DefaultItem
                        setIsWaitUpdate={setIsWaitUpdate}
                        setIsUpdateTile={setIsUpdateTiles}
                        itemData={tilesData[index]}
                        setTilesData={setTilesData}
                        tilesData={tilesData}
                        tilesIndex={index}
                        index={index}
                      />
                    </ResizableComponent>

                  )
                })}
                <ContextMenu
                  isVisible={isContextMenuVisible}
                  position={contextMenuPosition}
                  setIsContextMenuVisible={setIsContextMenuVisible}
                  onMenuItemClick={handleMenuItemClick}
                />
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
              <div
                className={styles.tiles_container}
                onDoubleClick={handleContainerDoubleClick}
              >

              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

}

import React, { useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from "react-responsive";
import MenuItemDesktop from './menu-item/Desktop/MenuItemDesktop';
import ContentItemDesktop from './content-item/Desktop/ContentItemDesktop';
import MenuItemMobile from './menu-item/Mobile/MenuItemMobile';
import ContentItemMobile from './content-item/Mobile/ContentItemMobile';
import { ItemService } from '../../../../../services/item.service';
import { UserService } from '../../../../../services/user.service';

function Authorize() {
  const isDesktop = useMediaQuery({
    query: "(min-width: 1050px)"
  });
  //Profile form
  const [showForm, setShowForm] = useState(false);
  //Notify form
  const [showNtfiForm, setShowNtfiForm] = useState(false);
  //Create project form
  const [showCRPForm, setShowCRPForm] = useState(false);
  const [projectsData, setProjectsData] = useState([]);
  const [isUpdatedProjects, setIsUpdatedProjects] = useState(null);
  const [userData, setUserData] = useState(null);
  window.scrollTo(0, 0);
  useEffect(() => {
    const fetchData = async () => {
      UserService.cookiesUpdate();
      ItemService.cookiesUpdate();
      if(setIsUpdatedProjects!=null){
        setIsUpdatedProjects(null);
      }
      const data = await ItemService.get_projects();
      const userData = await UserService.getOnlyUserAllFileds();
     
      setUserData(userData);
      setProjectsData(data);
      // console.log(userData)
    };

    fetchData();
  }, [showCRPForm,showForm,isUpdatedProjects]);
  return (
    <>
      {isDesktop ? <MenuItemDesktop
        setShowNtfiForm={setShowNtfiForm}
        showNtfiForm={showNtfiForm}
        setShowForm={setShowForm}
        setShowCRPForm={setShowCRPForm}
        showCRPForm={showCRPForm}
        userData={userData} /> :
        <MenuItemMobile
          setShowForm={setShowForm} />}

      {isDesktop ? <ContentItemDesktop
        showForm={showForm}
        setShowForm={setShowForm}
        showCRPForm={showCRPForm}
        setShowCRPForm={setShowCRPForm}
        projects={projectsData}
        setIsUpdatedProjects={setIsUpdatedProjects} /> :
        <ContentItemMobile
          showForm={showForm}
          setShowForm={setShowForm} />}
    </>

  )
}

export default Authorize
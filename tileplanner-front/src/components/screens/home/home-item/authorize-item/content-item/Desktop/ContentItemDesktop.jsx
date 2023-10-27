import React from 'react'
import styles from './Content.module.css'
import ProfileChangeFormDesktop from '../../UI/profile-change-form-item/Desktop/ProfileChangeFormDesktop'
import CreateProjectDesktop from '../../UI/create-project-item/Desktop/CreateProjectDesktop'
import ProjectItemDesktop from '../../UI/project-item/ProjectItemDesktop'

function ContentItemDesktop({ showForm, setShowForm, showCRPForm, setShowCRPForm, projects,setIsUpdatedProjects }) {
    // console.log(projects[0])
    return (
        <>
            <div className={styles.content}>
                <div className={styles.header}>
                    Мої проекти
                </div>
                <div className={styles.projects}>
                    {projects?.map((project) => {
                      return  <ProjectItemDesktop
                       key={project.id} 
                       project={project} 
                       setIsUpdatedProjects={setIsUpdatedProjects}/>
                    })}
                </div>
            </div>
            <ProfileChangeFormDesktop showForm={showForm} setShowForm={setShowForm} />
            <CreateProjectDesktop showCRPForm={showCRPForm} setShowCRPForm={setShowCRPForm} />
        </>
    )
}

export default ContentItemDesktop
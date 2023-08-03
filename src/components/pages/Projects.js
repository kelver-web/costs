import { useState, useEffect } from 'react';
//import { Dna } from 'react-loader-spinner';
import {MoonLoader} from 'react-spinners'
import styles from './Projects.module.css'
import LinkButton from '../layout/LinkButton';
import Container from '../layout/Container';

import ProjectCard from '../project/ProjectCard';

import api from '../../services/api'
import { toast } from 'react-toastify';


function Projects() {
    const [projects, setProjects] = useState([])
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            const getProjects = async () => {
            
                const { data } = await api.get('projects')
                setProjects(data)
                setLoader(true)
            }
            getProjects()
        },1000)
    }, [])


    const removeProject = async (id) => {
        try {
            await toast.promise(api.delete(`projects/${id}`), {
                pending: 'Deletando projeto...',
                error: 'Falha ao deletar o projeto',
                success: 'Projeto deletado com sucesso!'
            },
            { validateStatus: () => true }
            )
            
            setProjects(projects.filter((project) => project.id !== id))
            
        } catch (error) {
            console.log(`Error with status code 404 ${error}`)
        }
    }

    return (
        <div className={styles.project_container}>
            <div className={styles.project_title}>
                <h1>Meus Projetos</h1>
                <LinkButton to="/newproject" text="Criar Projeto" />
            </div>
            <Container customClass='start'>
                {projects.length > 0 &&
                    projects.map((project) => (
                        <ProjectCard
                            id={project.id}
                            name={project.name}
                            budget={project.budget}
                            category={project.category.name}
                            key={project.id}
                            handleRemove={removeProject}     
                        />
                    ))}
                <div className={styles.load_center}>
                    {!loader && <MoonLoader color="#000" height={80} width={80} />}
                    {loader && projects.length === 0 && (
                        <p>Não há projetos cadastrados</p>
                    )}
                </div>   
            </Container>
            
        </div>
    )
}

export default Projects

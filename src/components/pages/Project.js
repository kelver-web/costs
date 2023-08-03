import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
//import {Dna} from "react-loader-spinner";
import { MoonLoader } from 'react-spinners'
import { toast } from 'react-toastify'

import styles from './Project.module.css'

import api from '../../services/api'
import Container from '../layout/Container';
import ProjectForm from '../project/ProjectForm'
import ServiceForm from '../service/ServiceForm'
import ServiceCard from '../service/ServiceCard'

import { v4 as uuidv4 } from 'uuid'

import formateCurrency from '../../utils/formatCurrency'

function Project() {

    const { id } = useParams()
    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            const getProject = async () => {

                const { data } = await api.get(`projects/${id}`)
                setProject(data)
                setServices(data.services)
            }

            getProject()
        }, 1000)
    }, [id])

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }


    async function editPost(project) {
        // budget validation
        try {
            if (project.budget < project.cost) {
                toast.error('Orçamento não pode ser menor que o custo do projeto')
                return false
            }
        } catch (error) {
            console.log(error)
        }

        try {
            const { data } = await toast.promise(api.patch(`projects/${project.id}`, project), {
                pending: 'Atualizando projeto...',
                error: 'Falha ao atualizar o projeto',
                success: 'Projeto atualizado com sucesso'
            })

            setProject(data)
            setShowProjectForm(false)

        } catch (error) {
            console.log(error)
        }


        // fetch(`http://localhost:5000/projects/${project.id}`, {
        //     method: 'PATCH',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(project),
        // })
        // .then(resp => resp.json())
        // .then(data => {
        //     setProject(data)
        //     setShowProjectForm(false)
        // })
        // .catch(error => console.log(error))
    }

    async function createService(project){

        const lastService = project.services[project.services.length - 1]
        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        // Maximun value validation
        if(newCost > parseFloat(project.budget)){
            toast.error("Orçamento utrapassado, verifique o valor do serviço")
            project.services.pop()
            return false
        }

        // add service cost to project total cost
        project.cost = newCost

        // updated project
        await toast.promise(api.patch(`projects/${project.id}`, project), {
            pending: 'Atualizando serviço...',
            error: 'Falha ao adicionar o serviço',
            success: 'Serviço adicionado com sucesso'
        })
        setShowServiceForm(false)

        
        
    }

    async function removeService(id, cost){

        const filterService = project.services.filter(
            service => service.id !== id
        )

        const projectUpdated = project
        
        projectUpdated.services = filterService
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)
        
        try {
            await api.patch(`projects/${projectUpdated.id}`, projectUpdated)
          
            setProject(projectUpdated)
            setServices(filterService)
            toast.success("Serviço removido com sucesso!")
            
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? 'Editar projeto' : 'Fechar'}
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Categoria:</span> {project.category.name}
                                    </p>
                                    <p>
                                        <span>Total de Orçamento:</span> {formateCurrency(project.budget - project.cost)}
                                    </p>
                                    <p>
                                        <span>Total Utilizado:</span> {formateCurrency(project.cost)}
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm
                                        handleSubmit={editPost}
                                        btnText="Concluir Edição"
                                        projectData={project}
                                    />
                                </div>
                            )}
                        </div>
                        <div className={styles.service_form_container}>
                            <h2>Adicione Serviço:</h2>
                            <button className={styles.btn} onClick={toggleServiceForm}>
                                {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && (
                                    <ServiceForm 
                                        handleSubmit={createService}
                                        btnText="Adicionar Serviço"
                                        projectData={project}
                                    />
                                )}
                            </div>
                        </div>
                        <h2>Serviços</h2>
                        <Container customClass='start'>
                            {services.length > 0 && 
                                services.map(service => (
                                    <ServiceCard
                                        id={service.id}
                                        name={service.name}
                                        cost={service.cost}
                                        description={service.description}
                                        key={service.id}
                                        handleRemove={removeService}
                                    />
                                ))
                            }
                            {services.length === 0 && <p>Não há serviços cadastrados</p>}
                        </Container>
                    </Container>
                </div>
            ) : (
                <div className={styles.load_center}>
                    <div>
                        <MoonLoader color="#222" height={80} width={80} />
                    </div>
                </div>
            )}
        </>
    )
}

export default Project

/*
export 'default' (imported as 'Loader') was not found in 'react-loader-spinner' (possible exports: Audio, BallTriangle, Bars, Blocks, Circles, CirclesWithBar, ColorRing, Comment, Discuss, Dna, FallingLines, FidgetSpinner, Grid, Hearts, InfinitySpin, LineWave, MagnifyingGlass, MutatingDots, Oval, ProgressBar, Puff, Radio, RevolvingDot, Rings, RotatingLines, RotatingSquare, RotatingTriangles, TailSpin, ThreeCircles, ThreeDots, Triangle, Vortex, Watch)

*/
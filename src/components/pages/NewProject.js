import ProjectForm from '../project/ProjectForm'
import styles from './NewProject.module.css'
import { toast } from 'react-toastify'

import api from '../../services/api'
import { useNavigate } from 'react-router-dom';


function NewProject(){

    const navigate = useNavigate()

    const createPost = async (project) => {

        // initialize cost and services
        project.cost = 0
        project.services = []

       
        await toast.promise(api.post('projects', project), {
            pending: 'Criando novo projeto...',
            error: 'Falha ao criar o projeto',
            success: 'Projeto criado com sucesso'
        },
        { validateStatus: () => true }
        )

        setTimeout(() => {
            navigate('/projects')
        }, 2000)
    }

    return (
        <div className={styles.newproject_container}>
            <h1>Criar Projeto</h1>
            <p>Crie os seus projetos para depois adicionar os serviços</p>
            <ProjectForm handleSubmit={createPost} btnText="Criar Projeto"/>
        </div>
    )
}

export default NewProject

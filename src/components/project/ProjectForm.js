import {useState,useEffect} from 'react'
import api from '../../services/api'
import Input from '../form/Input'
import Select from '../form/Select'
import SubmitButton from '../form/SubmitButton'
import styles from './ProjectForm.module.css'


function ProjectForm({ handleSubmit, btnText, projectData }){
    const [categoies, setCategories] = useState([])
    const [project, setProject] = useState(projectData || {})

    useEffect(() => {
        const loadCategoies = async () => {
            const { data } = await api.get('categories')

            setCategories(data)
        }
        
        loadCategoies()
    }, [])

    const submit = (e) => {
        e.preventDefault()
        handleSubmit(project)
        //console.log(project)
    }

    function handleChange(e){
        setProject({...project, [e.target.name]: e.target.value})
        //console.log(project)
    }

    function handleCategoy(e){
        setProject({...project, category: {
                id: e.target.value,
                name: e.target.options[e.target.selectedIndex].text,
            },
        })

    }


    // useEffect(() => {
    //     fetch("http://localhost:5000/categories", {method: "GET", headers: {"Content-Type": "application/josn"}})
    //     .then(res => res.json())
    //     .then(data => setCategories(data))
    //     .catch(err => console.log(err))
    // }, [])

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input 
                type="text" 
                text="Nome do projeto" 
                name="name" 
                placeholder="Insira o nome do projeto"
                handleOnChange={handleChange}
                value={project.name ? project.name : ''}
                
            />
            <Input 
                type="number" 
                text="Orçamento do projeto" 
                name="budget" 
                placeholder="Insira o orçamento total"
                handleOnChange={handleChange}
                value={project.budget ? project.budget : ''}
                
            />
            <Select 
                name="category_id" 
                text="Selecione a categoria" 
                options={categoies}
                handleOnChange={handleCategoy}
                value={project.category ? project.category.id : ''}
            />
            <SubmitButton text={btnText}/>
        </form>
    )
}

export default ProjectForm

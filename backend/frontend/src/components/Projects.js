import React from 'react'
import {Link} from 'react-router-dom'

const options = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
}
  
function getDate(str) {
    var date = new Date(str);
    return date.toLocaleString('ru', options)
}

function get_params(str, users){
    var res = str.map(function (ID) {
        return users.find(function (a) {
            return a.id === ID;
        }).last_name;
    })
    return res
}

const ProjectItem = ({project, users, completedChange}) => {
    return (
        <tr>
            <td>
                <input type="checkbox" name="project_is_completed" checked={project.project_is_completed} onChange={(e) => completedChange('projects', project.id, e)}/>
            </td>
            <td>
                {getDate([project.created])}
            </td>
            <td>
                <Link to={`/projects/${project.id}`}>{project.title}</Link>
            </td>
            <td>
                {project.description}
            </td>
            <td>
                <a href={project.url_repo}>{project.url_repo}</a>
            </td>
            <td>
                {get_params(project.user, users)}
            </td>  
            <td>
                {project.project_is_completed? 'Завершен': 'В работе'}
            </td>
        </tr>
    )
}

const ProjectList = ({projects, users, completedChange}) => {
    return (
        <table className='table'>
            <th>                
            </th>
            <th>
                Дата
            </th>
            <th>
                Название
            </th>
            <th>
                Описание
            </th>
            <th>
                Репозиторий
            </th>
            <th>
                Создал
            </th>   
            <th>
                Статус
            </th>
            
            {projects.map((project) => <ProjectItem project={project} users={users} completedChange={completedChange}/>)}
        </table>
    )
}

export default ProjectList
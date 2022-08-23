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
            return a.id == ID;
        }).last_name;
    })
    return res
}

const ProjectItem = ({project, users}) => {
    return (
        <tr>
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
                {/* {project.user.map(ID => user[0].find(a => a.id == ID).last_name)} */}
                {get_params(project.user, users)}
            </td>  
            <td>
                <input type="checkbox" checked={project.project_is_completed} /> {project.project_is_completed? 'Завершен': 'В работе'}
            </td>          
        </tr>
    )
}

const ProjectList = ({projects, users}) => {
    return (
        <table className='table'>
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
            {projects.map((project) => <ProjectItem project={project} users={users}/>)}
        </table>
    )
}

export default ProjectList
import React from 'react'
import {Link} from 'react-router-dom'

const options = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }
  
  function getDate(str) {
    var date = new Date(str);
    return date.toLocaleString('ru', options)
  }

const ProjectItem = ({project, users}) => {
    return (
        <tr>
            <td>
                <Link to={`/projects/${project.id}`}>{project.title}</Link>
            </td>
            <td>
                {project.description}
            </td>
            <td>
                {project.url_repo}
            </td>
            <td>
                {project.user.map(id => users.find(a => a.id == id).last_name)}
            </td>
            <td>
                {getDate(project.created)}
            </td>
        </tr>
    )
}

const ProjectList = ({projects, users}) => {
    return (
        <table>
            <th>
                Название проекта
            </th>
            <th>
                Описание проекта
            </th>
            <th>
                Url репозиторий
            </th>
            <th>
                Создал проект
            </th>
            <th>
                Дата
            </th>
            {projects.map((project) => <ProjectItem project={project} users={users}/>)}
        </table>
    )
}

export default ProjectList
import React from 'react'
// import {useParams} from 'react-router-dom'

const options = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',  
}
  
function getDate(str) {
    var date = new Date(str);
    return date.toLocaleString('ru', options)
}
  


const ToDoItem = ({todo, users}) => {   
    
    return (
        <tr>
            
            <td>
                {todo.comment}
            </td>
            <td>
                {todo.user}
            </td>
            <td>
                {getDate(todo.created_at)}
            </td>
            
        </tr>
    )
}

const ToDoList = ({todos, users}) => {    

    return (
        <table>
            
            <th>
                Комментарий
            </th>
            <th>
                Создал заметку
            </th>
            <th>
                Дата
            </th>
            
            {todos.map((todo) => <ToDoItem todo={todo} users={users}/>)}
        </table>
    )
}

export default ToDoList
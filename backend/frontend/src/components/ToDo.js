import React from 'react'
// import {useParams} from 'react-router-dom'

const options = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    // hour: 'numeric',
    // minute: 'numeric',
    // second: 'numeric',  
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

const ToDoItem = ({todo, users}) => {   
    
    return (
        <tr>
            <td>
                {getDate(todo.created_at)}
            </td>
            <td>
                {todo.comment}
            </td>
            <td>
                {/* {[todo.user].map(ID => user[0].find(a => a.id == ID).last_name)} */}
                {get_params([todo.user], users)}
            </td>   
            <td>
                <input type="checkbox" checked={todo.todo_is_completed} /> {todo.todo_is_completed? 'Завершить': 'В работе'}              
            </td>          
        </tr>
    )
}

const ToDoList = ({todos, users}) => {    

    return (
        <table className='table'>
            <th>
                Дата
            </th>
            <th>
                Задача
            </th>
            <th>
                Создал
            </th>  
            <th>
                Статус
            </th>            
            {todos.map((todo) => <ToDoItem todo={todo} users={users}/>)}
        </table>
    )
}

export default ToDoList
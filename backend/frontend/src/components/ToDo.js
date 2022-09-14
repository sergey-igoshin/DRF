import React from 'react'

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
            return a.id === ID;
        }).last_name;
    })
    return res
}

const ToDoItem = ({todo, users, completedChange}) => {   
    
    return (
        <tr>
            <td>
                <input type="checkbox" name="todo_is_completed" checked={todo.todo_is_completed} onChange={(e) => completedChange('todos', todo.id, e)}/>
            </td>
            <td>
                {getDate(todo.created_at)}
            </td>
            <td>
                {todo.comment}
            </td>
            <td>
                {get_params([todo.user], users)}
            </td>   
            <td>
                {todo.todo_is_completed? 'Завершена': 'В работе'}              
            </td>
        </tr>
    )
}

const ToDoList = ({todos, users, completedChange}) => {    

    return (
        <table className='table'>
            <th>                
            </th>
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
            
            {todos.map((todo) => <ToDoItem todo={todo} users={users} completedChange={completedChange}/>)}
        </table>
    )
}

export default ToDoList
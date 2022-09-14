import React from 'react'

const UserItem = ({user, deleteUser, completedChange}) => {
    return (
        <tr>
            <td>
                {user.username}
            </td>
            <td>
                {user.first_name}
            </td>
            <td>
                {user.last_name}
            </td>
            <td>
                {user.email}
            </td>
            <td>
                <div>
                    <input type="checkbox" name="is_superuser" checked={user.is_superuser} onChange={(e) => completedChange('users', user.id, e)}/> Администратор
                </div>
                <div>
                    <input type="checkbox" name="is_staff" checked={user.is_staff} onChange={(e) => completedChange('users', user.id, e)}/> Персонал
                </div>
            </td>
            <td>
                <button onClick={() => deleteUser(user.id)}>Удалить</button>
            </td>
        </tr>
    )
}

const UserList = ({users, deleteUser, completedChange}) => {
    return (
        <table className='table'>
            <th>
                Nik
            </th>
            <th>
                Имя
            </th>
            <th>
                Фамилия
            </th>
            <th>
                Email
            </th>
            <th>
                Статус
            </th>
            <th>                
            </th>            
            {users.map((user) => <UserItem user={user} deleteUser={deleteUser} completedChange={completedChange}/>)}
        </table>
    )
}

export default UserList
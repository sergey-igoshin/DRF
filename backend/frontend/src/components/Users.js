import React from 'react'

const UserItem = ({user}) => {
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
                {/* <input type="checkbox" checked={user.is_active} /> {user.is_active? 'Активен': 'Не активен'} */}
                <div>
                    <input type="checkbox" checked={user.is_superuser} /> Администратор
                </div>
                <div>
                    <input type="checkbox" checked={user.is_staff} /> Персонал
                </div>
            </td>
        </tr>
    )
}

const UserList = ({users}) => {
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
            {users.map((user) => <UserItem user={user} />)}
        </table>
    )
}

export default UserList
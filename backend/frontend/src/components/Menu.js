import React from 'react'

const MenuItem = ({menu}) => {
    return (
        <li>
            <a href={menu.url}>{menu.name}</a>
        </li>       
    )
}

const MenuList = ({list_menu}) => {
    return (
        <ul className="mainmenu">
            {list_menu.map((menu) => <MenuItem menu={menu} />)}
        </ul>
    )
}

export default MenuList
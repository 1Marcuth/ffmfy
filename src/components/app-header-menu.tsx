import { Link } from "react-router-dom"
import { FC } from "react"

type MenuItem = {
    name: string
    icon: string
    path: string
    target?: string
}

const menuItems: MenuItem[] = [
    {
        name: "Home",
        icon: "bi bi-house",
        path: "/"
    }
]

const AppHeaderMenu: FC = () => {
    return (
        <ul className="flex">
            {menuItems.map(menuItem => {
                return (
                    <li key={menuItem.name}>
                        <Link 
                            to={menuItem.path}
                            target={menuItem.target ?? "_self"}
                            className="text-white flex gap-2 py-2 px-4 rounded-md hover:text-slate-200 hover:bg-slate-800"
                        >
                            <i className={menuItem.icon}/>
                            <span>{menuItem.name}</span>
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}

export default AppHeaderMenu
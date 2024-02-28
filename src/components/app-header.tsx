import { FC } from "react"

import AppHeaderLogo from "./app-header-logo"
import AppHeaderMenu from "./app-header-menu"

const AppHeader: FC = () => {
    return (
        <>
            <div className="w-full h-[70px] bg-slate-900"/>
            <header className="w-full h-[70px] fixed top-0 left-0 backdrop-blur-sm backdrop-brightness-75 flex justify-between items-center p-4 border-b-[1px] border-b-slate-800">
                <AppHeaderLogo/>
                <AppHeaderMenu/>
            </header>
        </>
    )
}

export default AppHeader
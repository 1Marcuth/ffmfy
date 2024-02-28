import { Link } from "react-router-dom"
import { FC } from "react"

const AppHeaderLogo: FC = () => {
    return (
        <span>
            <Link to="/" className="text-white text-lg font-semibold">FFmfy</Link>
        </span>
    )
}

export default AppHeaderLogo
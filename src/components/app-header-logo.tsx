import { FC } from "react"
import { Link } from "react-router-dom"

const AppHeaderLogo: FC = () => {
    return (
        <span>
            <Link to="/" className="text-white text-lg font-semibold">FFmfy</Link>
        </span>
    )
}

export default AppHeaderLogo
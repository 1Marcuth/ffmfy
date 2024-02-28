import { FC, HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLDivElement> & {
    children: any
}

const Container: FC<Props> = ({ children, ...props }) => {
    const { className, ...remainingProps } = props
    const containerClassName = `flex justify-center w-full min-h-screen ${className}`

    return (
        <div className={containerClassName} {...remainingProps}>
            <div className="w-full max-w-[1000px]">{children}</div>
        </div>
    )
}

export default Container
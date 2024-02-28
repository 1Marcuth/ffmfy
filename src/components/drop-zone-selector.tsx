import { FC, useEffect, useState } from "react"
import { getFileExtension, openFile } from "client-helper/dist"

import handleDragFile from "src/lib/handle-drag-file"

interface IProps {
    fileTypes: string[]
    minSizeInBytes?: number
    maxSizeInBytes?: number
    closedWindowCheckDelay?: number
    onFileChange: (file: File) => any
}

const DropZoneSelector: FC<IProps> = ({
    fileTypes,
    minSizeInBytes,
    maxSizeInBytes,
    closedWindowCheckDelay,
    onFileChange
}) => {
    const [ dragging, setDragging ] = useState(false)
    const [ file, setFile ] = useState<File>()

    function handleDragOver(event: React.DragEvent<HTMLDivElement>): void {
        event.preventDefault()
        setDragging(true)
    }

    function handleDragLeave(): void {
        setDragging(false)
    }

    async function handleDrop(event: React.DragEvent<HTMLDivElement>): Promise<void> {
        event.preventDefault()
        setDragging(false)

        const file = await new Promise<File>((resolve, reject) => {
            handleDragFile({
                event: event,
                types: fileTypes,
                minSizeInBytes: minSizeInBytes,
                maxSizeInBytes: maxSizeInBytes,
                resolve: resolve,
                reject: reject
            })
        })

        setFile(file)
    }

    async function handleClick(): Promise<void> {
        const file = await openFile({
            types: fileTypes,
            minSizeInBytes: minSizeInBytes,
            maxSizeInBytes: maxSizeInBytes,
            closedWindowCheckDelay: closedWindowCheckDelay
        })

        setFile(file)
    }

    useEffect(() => {
        if (!file) return
        onFileChange(file)
    }, [file])

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            title={file ? "Clique aqui para trocar o arquivo!" : "Clique aqui para selecionar um arquivo!"}
            className={`bg-slate-800 p-2 w-full h-[200px] rounded-2xl flex items-center justify-center flex-col border-[1px] transition-[background] cursor-pointer duration-500 hover:bg-slate-700 ${!dragging && "border-slate-600"} ${dragging && "border-[2px] border-blue-500 border-dashed"} ${file && "h-[50px]"}`}
        >
            {file ? (
                <div className="flex gap-2 text-xs">
                    <i className="bi bi-file-earmark"/>
                    {(() => {
                        const fileExtesion = getFileExtension({ fileName: file.name })

                        return (
                            <div className="flex gap-0">
                                {file.name.length > 25 ? (
                                    <>
                                        {file.name.slice(0, 14)} <span className="text-slate-400">...</span>
                                        {file.name.slice(file.name.length - (fileExtesion.length + 6), file.name.length)}
                                    </>
                                ) : file.name}
                            </div>
                        )
                    })()}
                </div>
            ) : (
                <>
                    <span className="text-[4rem]"><i className="bi bi-cloud-arrow-up"/></span>
                    <span className="text-sm">
                        {dragging ? (
                            <span className="flex items-center gap-2">
                                <span>Bom, agora apenas solte</span>
                                <i className="bi bi-emoji-smile-upside-down text-yellow-200"/>
                            </span>
                        ) : "Selecione um arquivo ou solte aqui!"}
                    </span>
                </>
            )}
        </div>
    )
}

export default DropZoneSelector

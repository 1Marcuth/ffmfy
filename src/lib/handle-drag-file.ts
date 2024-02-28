import { FileTooSmallError, FileTooLargeError } from "client-helper/dist"
import { DragEvent } from "react"

export type HandleDragFileOptions = {
    event: DragEvent<HTMLDivElement>,
    minSizeInBytes?: number,
    maxSizeInBytes?: number,
    types: string[],
    resolve: (value: any) => any,
    reject: (error: any) => any
}

function handleDragFile({
    event,
    minSizeInBytes,
    maxSizeInBytes,
    types,
    resolve,
    reject,
}: HandleDragFileOptions) {
    const fileList = event.dataTransfer.files
    if (!fileList || fileList.length === 0) {
        return reject(new Error("Nenhum arquivo selecionado"))
    }
    const file = fileList[0]

    let isValidFileType = false
    if (types.includes("*") || types.includes("*/")) {
        isValidFileType = true
    } else {
        for (const type of types) {
            if (
                file.type.startsWith(type.split("/")[0]) ||
                file.name.endsWith(type)
            ) {
                isValidFileType = true
            }
        }
    }
    if (!isValidFileType) {
        const fileExtension = getFileExtension(file.name)
        return reject(
            new Error(`Tipo de arquivo inválido: ${fileExtension}`)
        )
    }

    if (minSizeInBytes && file.size < minSizeInBytes) {
        return reject(
            new FileTooSmallError(minSizeInBytes, maxSizeInBytes ?? NaN)
        )
    }

    if (maxSizeInBytes && file.size > maxSizeInBytes) {
        return reject(
            new FileTooLargeError(minSizeInBytes ?? NaN, maxSizeInBytes)
        )
    }

    return resolve(file)
}

function getFileExtension(fileName: string): string {
    return fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2)
}

export default handleDragFile
import { fetchFile } from "@ffmpeg/util"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { FC, useState } from "react"

import MediaConverterCard from "../components/media-converter-card"
import MediaOutputCard from "../components/media-output-card"
import AppHeader from "../components/app-header"
import Container from "../components/container"
import isMedia, { MediaType } from "../lib/is-media"

const HomePage: FC = () => {
    const [ outputFileExtension, setOutputFileExtesion ] = useState<string>()
    const [ inputFileExtension, setInputFileExtesion ] = useState<string>()
    const [ outputMediaSource, setOutputMediaSource ] = useState<string>()
    const [ outputMediaType, setOutputMediaType ] = useState<MediaType>()
    const [ outputFileName, setOutputFileName ] = useState<string>()
    const [ convertProgress, setConvertProgress ] = useState(0)

    const handleButtonConvertClick = async (
        event: React.MouseEvent<HTMLButtonElement>,
        ffmpeg: FFmpeg,
        inputFile: File,
        inputFileFormat: string,
        outputFileFormat: string
    ): Promise<void> => {
        const outputFileName = `${inputFile.name.replace(`.${inputFileFormat}`, `.${outputFileFormat}`)}`
        const inputFileDataUrl = await fetchFile(inputFile)

        const mediaType = isMedia(outputFileName)

        if (!mediaType) {
            return alert("Ocorreu um erro ao tentar determinar o `mediaType` do arquivo de saída!")
        }

        setInputFileExtesion(inputFileFormat)
        setOutputFileExtesion(outputFileFormat)
        setOutputMediaType(mediaType)
        setOutputFileName(outputFileName)

        await ffmpeg.writeFile(inputFile.name, inputFileDataUrl)
        await ffmpeg.exec(["-i", inputFile.name, outputFileName])

        const outputFileData = await ffmpeg.readFile(outputFileName)
        const data = new Uint8Array(outputFileData as ArrayBuffer)
        const blob = new Blob([data.buffer])
        const blobURL = URL.createObjectURL(blob)

        setOutputMediaSource(blobURL)
    }

    const handleInputFileChange = () => {
        setInputFileExtesion(undefined)
        setOutputFileExtesion(undefined)
        setOutputMediaType(undefined)
        setOutputFileName(undefined)
        setOutputMediaSource(undefined)
        setConvertProgress(0)
    }

    return (
        <div>
            <AppHeader/>
            <Container className="p-2 md:p-0">
                <div className="my-10"/>
                <MediaConverterCard
                    onButtonConvertClick={handleButtonConvertClick}
                    onConvertProgress={setConvertProgress}
                    onInputFileChange={handleInputFileChange}
                />
                <div className="my-5"/>
                {outputFileExtension && (
                    <MediaOutputCard
                        inputFileExtension={inputFileExtension}
                        outputFileExtension={outputFileExtension}
                        outputFileName={outputFileName}
                        outputMediaType={outputMediaType}
                        convertProgress={convertProgress}
                        source={outputMediaSource}
                    />
                )}
            </Container>
        </div>
    )
}

export default HomePage
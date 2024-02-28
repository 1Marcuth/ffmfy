import { FC, useEffect, useRef, useState } from "react"
import { getFileExtension } from "client-helper"
import { SyncLoader } from "react-spinners"
import { toBlobURL } from "@ffmpeg/util"
import { FFmpeg } from "@ffmpeg/ffmpeg"

import { Select, SelectGroup, SelectTrigger, SelectContent, SelectValue, SelectLabel, SelectItem } from "./ui/select"
import { MediaFileFormat, supportedAudioFormats, supportedVideoFormats } from "../settings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import removeDuplicates from "../lib/remove-duplicates"
import DropZoneSelector from "./drop-zone-selector"
import isMedia from "../lib/is-media"
import { Button } from "./ui/button"

type OnButtonConvertClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    ffmpeg: FFmpeg,
    inputFile: File,
    inputFileFormat: string,
    outputFileFormat: string
) => void

type Props = {
    onButtonConvertClick: OnButtonConvertClick
    onConvertProgress: (progress: number) => any
    onInputFileChange: () => any
}

const MediaConverterCard: FC<Props> = ({ onButtonConvertClick, onConvertProgress, onInputFileChange }) => {
    const [ outputFileFormats, setFileOutputFormats ] = useState<MediaFileFormat[]>([])
    const [ outputFileFormat, setOutputFileFormt ] = useState<MediaFileFormat>()
    const [ inputFileFormat, setInputFileFormt ] = useState<MediaFileFormat>()
    const [ ffmpegIsLoaded, setFfmpegIsLoaded ] = useState<boolean>(false)
    const [ convertProgress, setConvertProgress ] = useState<number>(0)
    const [ inputFile, setInputFile ] = useState<File>()
    const ffmpegRef = useRef(new FFmpeg())

    const handleFileChange = (newInputFile: File) => {
        const newInputFileExtesion = getFileExtension({ fileName: newInputFile.name })
        const mediaType = isMedia(newInputFile.name)

        if (mediaType) {
            setInputFile(newInputFile)
            setOutputFileFormt(undefined)
            setInputFileFormt(newInputFileExtesion)

            if (mediaType === "video") {
                const videoAndAudioFormats = removeDuplicates([...supportedVideoFormats, ...supportedAudioFormats])
                setFileOutputFormats(videoAndAudioFormats)
            } else if (mediaType === "audio") {
                setFileOutputFormats(supportedAudioFormats)
            }
        } else {
            return alert(`O formato de arquivo \`.${newInputFileExtesion}\` não é um formato de aquivo de mídia suportado atualmente!`)
        }
    }

    const handleButtonConvertClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        if (!outputFileFormat || !inputFile || !inputFileFormat) {
            return alert("Selecione um arquivo válido e um formato de saída antes de converter a mída!")
        }

        onButtonConvertClick(
            event,
            ffmpegRef.current,
            inputFile,
            inputFileFormat,
            outputFileFormat.toLowerCase()
        )
    }

    useEffect(() => {
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd"
        const ffmpeg = ffmpegRef.current

        ffmpeg.on("log", ({ message }) => {
            console.log(message)
        })

        ffmpeg.on("progress", ({ progress }) => {
            setConvertProgress(progress * 100)
        })

        new Promise(async (resolve, reject) => {
            try {
                await ffmpeg.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm")
                })
            } catch(error) {
                return reject(error)
            }
            
            return resolve(null)
        })
            .then(() => setFfmpegIsLoaded(true))
            .catch(() => alert("Erro ao tentar carregar o FFmpeg!"))
    }, [ffmpegRef])

    useEffect(() => {
        if (!inputFile) return
        onInputFileChange()
    }, [inputFile])

    useEffect(() => {
        onConvertProgress(convertProgress)
    }, [convertProgress])

    return (
        <Card className="dark animate-load-from-top">
            <CardHeader>
                <CardTitle className="text-white text-center text-xl">FFmfy</CardTitle>
                <CardDescription className="text-center block">
                    <span className="block mt-5"/>
                    <span>Converta vídeos e áudios para um formato diferente gratuitamente.</span>
                    <span className="block mb-6"/>
                </CardDescription>
            </CardHeader>
            <CardContent>
                {ffmpegIsLoaded ? (
                    <div>
                        <DropZoneSelector
                            fileTypes={["video/*", "audio/*"]}
                            onFileChange={handleFileChange}
                            closedWindowCheckDelay={60000}
                        />
                        {inputFile && (
                            <div className="mt-3">
                                <div className="flex gap-1">
                                    <Select onValueChange={setOutputFileFormt} value={outputFileFormat}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o formato de saída"/>
                                        </SelectTrigger>
                                        <SelectContent className="dark w-full">
                                            <SelectGroup>
                                                <SelectLabel>Formatos disponíveis</SelectLabel>
                                                {outputFileFormats.map((fileFormat, i) => {
                                                    return (
                                                        <SelectItem value={fileFormat} key={`${fileFormat}-${i}`}>
                                                            <span className="flex gap-2">
                                                                <i className="bi bi-file-earmark text-slate-500"/>
                                                                <span>{fileFormat}</span>
                                                            </span>
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        onClick={handleButtonConvertClick}
                                        disabled={outputFileFormat && inputFile ? false : true}
                                    >
                                        <i className="bi bi-arrow-right"/>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 justify-center animate-pulse">
                        <SyncLoader color="rgb(71 85 105 / var(--tw-bg-opacity)" size={6}/>
                        <span className="text-slate-300">Carregando FFmpeg...</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default MediaConverterCard
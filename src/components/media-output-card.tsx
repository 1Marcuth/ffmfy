import { saveAs } from "file-saver"
import { FC } from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"
import isMedia, { MediaType } from "../lib/is-media"
import { Progress } from "./ui/progress"
import { Button } from "./ui/button"
import Audio from "./audio"

type Props = {
    inputFileExtension?: string
    outputFileExtension?: string
    outputFileName?: string
    source?: string
    convertProgress?: number
    outputMediaType?: MediaType
}

const MediaOutputCard: FC<Props> = ({
    inputFileExtension,
    outputFileExtension,
    outputFileName,
    source,
    convertProgress,
    outputMediaType
}) => {
    const inputMediaType = isMedia(`.${inputFileExtension}`)

    const handleButtonDownloadClick = (): void => {
        saveAs(source!, outputFileName)
    }

    return (
        <Card className="dark">
            <CardHeader>
                <CardTitle className="text-white text-center text-xl">
                    {source && outputMediaType && outputFileName && inputFileExtension && outputFileExtension ? (
                        <span>Resultado da conversão <i className="bi bi-arrow-left-right text-slate-500"/></span>
                    ) : (
                        <span className="animate-pulse">Convertendo seu arquivo...</span>
                    )} 
                </CardTitle>
                <CardDescription className="text-center block">
                    <span className="block mt-5"/>
                    <span className="flex gap-2 items-center justify-center">
                        <i className="bi bi-gear animate-spin-slow"/>
                        <span className={`text-slate-500 ${!(
                            source &&
                            outputMediaType &&
                            outputFileName &&
                            inputFileExtension &&
                            outputFileExtension
                        ) && "animate-pulse"}`}>Conversão</span>
                        <span>de {inputFileExtension} ({inputMediaType === "audio" ? "áudio" : "vídeo"}) <i className="bi bi-arrow-right text-slate-500"/> {outputFileExtension} ({outputMediaType === "audio" ? "áudio" : "vídeo"})</span>
                    </span>
                    <span className="block mb-6"/>
                </CardDescription>
            </CardHeader>
            <CardContent>
                {source && outputMediaType && outputFileName && inputFileExtension && outputFileExtension ? (
                    <>
                        {outputMediaType === "audio" ? (
                            <Audio
                                fileName={outputFileName}
                                source={source}
                            />
                        ) : (
                            <video
                                className="rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] shadow-slate-900 w-full"
                                controls={true}
                                src={source}
                            />
                        )}
                        <Button
                            variant="outline"
                            className="w-full flex mt-3 gap-2"
                            onClick={handleButtonDownloadClick}
                        >
                            <i className="bi bi-download"/>
                            Baixar arquivo
                        </Button>
                    </>
                ) : (
                    <Progress
                        value={convertProgress}
                        className="animate-pulse"
                    />
                )}
            </CardContent>
        </Card>
    )
}

export default MediaOutputCard
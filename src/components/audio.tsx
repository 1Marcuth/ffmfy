import { FC, useEffect, useRef, useState } from "react"
import { getFileExtension } from "client-helper"

import formatSecondsToTime from "../lib/seconds-to-time"
import { Progress } from "./ui/progress"

type PlayOrPause = "play" | "pause"

type Props = {
    fileName: string
    source: string
}

const Audio: FC<Props> = ({ fileName, source }) => {
    const audioRef = useRef(document.createElement("audio"))
    const [ isPaused, setIsPaused ] = useState<boolean>(audioRef.current.paused)
    const [ currentTime, setCurrentTime ] = useState<string>("0:00")
    const [ progress, setProgress ] = useState<number>(0)
    
    const handleAudioReproductionAction = (action: PlayOrPause): void => {
        if (action === "pause") {
            setIsPaused(true)
        } else if (action === "play") {
            setIsPaused(false)
        }
    }

    useEffect(() => {
        audioRef.current.src = source
    }, [source])

    useEffect(() => {
        if (isPaused) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }

        const interval = setInterval(() => {
            if (isPaused) return

            const formattedCurrentTime = formatSecondsToTime(Math.floor(audioRef.current.currentTime))
            const newProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100

            setProgress(newProgress)
            setCurrentTime(formattedCurrentTime)
        }, 1000)

        return () => {
            if (!isPaused) setIsPaused(true)
            clearInterval(interval)
        }
    }, [isPaused])

    return (
        <div className="w-full px-4 py-3 rounded-2xl bg-slate-800 border-[1px] border-slate-700">
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center text-xs mb-2">
                    <i className="bi bi-file-earmark-music text-slate-400"/>
                    <span className="text-slate-200" title={fileName}>
                        {(() => {
                                const fileExtesion = getFileExtension({ fileName: fileName })
                                return (
                                    <div className="flex gap-0">
                                        {fileName.length > 35 ? (
                                            <>
                                                {fileName.slice(0, 24)} <span className="text-slate-400">...</span>
                                                {fileName.slice(fileName.length - (fileExtesion.length + 6), fileName.length)}
                                            </>
                                        ) : fileName}
                                    </div>
                                )
                            })()}
                    </span>
                </div>
                <span className="text-xs text-slate-300">{currentTime}</span>
            </div>
            <div className="flex justify-center items-center gap-2">
                <span className="cursor-pointer text-lg">
                    {isPaused ? (
                        <button
                            title="Continuar reprodução..."
                            onClick={() => handleAudioReproductionAction("play")}
                        >
                            <i className="bi bi-play"/>
                        </button>
                    ) : (
                        <button
                            title="Pausar reprodução..."
                            onClick={() => handleAudioReproductionAction("pause")}
                        >
                            <i className="bi bi-pause"/>
                        </button>
                    )}
                </span>
                <Progress value={progress} className="h-2"/>
            </div>
        </div>
    )
}

export default Audio
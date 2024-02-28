import { getFileExtension } from "client-helper"

import { supportedAudioFormats, supportedVideoFormats } from "../settings"

export type MediaType = "audio" | "video" | false

function isMedia(fileName: string): MediaType {
    const fileExtesion = getFileExtension({ fileName: fileName })

    if (supportedAudioFormats.includes(fileExtesion.toUpperCase())) {
        return "audio"
    } else if (supportedVideoFormats.includes(fileExtesion.toUpperCase())) {
        return "video"
    }

    return false
}

export default isMedia
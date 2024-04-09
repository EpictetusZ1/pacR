import { SimpleRun } from "@/types/Main.types"
import { NumberValue } from "d3";

export const formatRunData = (run: any): SimpleRun => {
    return {
        id: run.id,
        activeDurationMs: formatMillisecondsToTime(Number(run.activeDurationMs)),
        startEpoch: new Date(run.startEpoch).toLocaleDateString("en-GB"),
        distance: Number(run.distance.toFixed(2)),
        pace: formatPace(run.pace),
    }
}

export const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

// Remove any dashes or underscores and capitalize the first letter of each word
export const toTitleCase = (str: string) => {
    str = str.replace(/[_-]/g, " ")
    let words = str.split(" ")
    return words.map((word: string) => {
        return word
            .replace(/\b(\w)/g, s => s.toUpperCase())
            .replace(/([a-z])([A-Z])/g, '$1 $2')
    }).join(" ").trim()
}


export const formatMillisecondsToTime = (bigNum: number | NumberValue | bigint): string => {
    if (bigNum === 0) {
        return "0"
    }
    let milliseconds: number = Number(bigNum)
    let seconds = Math.floor(milliseconds / 1000)
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)

    seconds = seconds % 60
    minutes = minutes % 60

    const parts = [
        hours ? `${hours}` : null,
        `${minutes < 10 ? (hours ? "0" : "") : ""}${minutes}`,
        `${seconds < 10 ? "0" : ""}${seconds}`
    ].filter(Boolean) // Remove null values

    const timeString = parts.join(":")
    return timeString.startsWith("0") ? timeString.substring(1) : timeString
}

export const formatPace = (pace: number) => {
    const paceSeconds = Math.round(pace * 60)
    const minutes = Math.floor(paceSeconds / 60).toString()
    const seconds = (paceSeconds % 60).toString().padStart(2, "0")
    return `${minutes}'${seconds}"`
}

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

export const formatMillisecondsToTime = (bigNum: number | NumberValue): string => {
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
    ].filter(Boolean); // Remove null values

    const timeString = parts.join(":")
    return timeString.startsWith("0") ? timeString.substring(1) : timeString
}

export const formatPace = (pace: number) => {
    const paceSeconds = Math.round(pace * 60)
    const minutes = Math.floor(paceSeconds / 60).toString()
    const seconds = (paceSeconds % 60).toString().padStart(2, "0")
    return `${minutes}'${seconds}"`
}
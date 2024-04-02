import { SimpleRun } from "@/types/Main.types"
import { NumberValue } from "d3";

export const formatRunData = (run: any): SimpleRun => {
    const formatPace = (pace: number) => {
        const paceSeconds = Math.round(pace * 60)
        const minutes = Math.floor(paceSeconds / 60).toString()
        const seconds = (paceSeconds % 60).toString().padStart(2, "0")
        return `${minutes}'${seconds}"`
    }

    return {
        id: run.id,
        activeDurationMs: formatMillisecondsToTime(Number(run.activeDurationMs)),
        startEpoch: new Date(run.startEpoch).toLocaleDateString("en-GB"),
        distance: Number(run.distance.toFixed(2)),
        pace: formatPace(run.pace),
    }
}

export function formatMillisecondsToTime(bigNum: number | NumberValue): string {
    let milliseconds: number = Number(bigNum)
    let seconds = Math.floor(milliseconds / 1000)
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)

    seconds = seconds % 60
    minutes = minutes % 60

    // Formatting to HH:MM:SS, removing leading zeros
    return [hours, minutes, seconds]
        .map(val => val < 10 ? `0${val}` : val.toString())
        .join(":")
        .replace(/^0+:|0:|^0/gm, "")
}

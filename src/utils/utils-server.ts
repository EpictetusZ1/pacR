import { SimpleRun } from "@/types/Main.types"

export const formatRunData = (run: any): SimpleRun => {
    const formatDuration = (ms: number) => {
        const hours = Math.floor(ms / 3600000)
        const minutes = Math.floor((ms % 3600000) / 60000).toString().padStart(2, "0")
        const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0")
        return `${hours > 0 ? hours + ":" : ""}${minutes}:${seconds}`
    }

    const formatPace = (pace: number) => {
        const paceSeconds = Math.round(pace * 60)
        const minutes = Math.floor(paceSeconds / 60).toString()
        const seconds = (paceSeconds % 60).toString().padStart(2, "0")
        return `${minutes}'${seconds}"`
    }

    return {
        id: run.id,
        activeDurationMs: formatDuration(Number(run.activeDurationMs)),
        startEpoch: new Date(run.startEpoch).toLocaleDateString("en-GB"),
        distance: Number(run.distance.toFixed(2)),
        pace: formatPace(run.pace),
    }
}

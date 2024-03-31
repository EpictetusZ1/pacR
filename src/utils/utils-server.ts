import { SimpleRun, SimpleSummary } from "@/types/Main.types"

export const formatRunData = (run: any): SimpleRun => {
    const durationMs = Number(run.activeDurationMs)
    const hours = Math.floor(durationMs / 3600000)
    const minutes = Math.floor((durationMs % 3600000) / 60000)
    const seconds = Math.floor((durationMs % 60000) / 1000)
    let parts = []
    if (hours > 0) parts.push(hours)
    parts.push(minutes)
    parts.push(seconds)

    const durationStr = parts.join(':')
    const startEpoch = new Date(run.startEpoch).toLocaleDateString("en-GB")

    let distance: number = 0
    let pace: string = ""

    run.summaries.forEach((summary: SimpleSummary) => {
        if (summary.metricType === "distance" && distance === 0) {
            distance = Number(summary.value.toFixed(2)) // Assuming you want to round to 2 decimal places
        } else if (summary.metricType === "pace" && pace === "") {
            const paceSeconds = Math.round(summary.value * 60) // Convert pace to seconds
            const paceHours = Math.floor(paceSeconds / 3600)
            const paceMinutes = Math.floor((paceSeconds % 3600) / 60)
            const paceSec = paceSeconds % 60

            let paceFormatted = `${paceMinutes}'${paceSec < 10 ? "0" : ""}${paceSec}"`
            if (paceHours > 0) {
                paceFormatted = `${paceHours}'${paceFormatted}`
            }
            pace = paceFormatted
        }
    })

    return {
        id: run.id,
        activeDurationMs: durationStr,
        startEpoch,
        distance, 
        pace,
    }
}

import { SimpleRun } from "@/types/Main.types"

export const formatRunData = (run: SimpleRun) => {
    console.log(run)
    const durationMs = Number(run.activeDurationMs)

    const hours = Math.floor(durationMs / 3600000)
    const minutes = Math.floor((durationMs % 3600000) / 60000)
    const seconds = Math.floor((durationMs % 60000) / 1000)
    const durationStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

    const startEpoch = new Date(run.startEpoch).toLocaleDateString("en-GB")

    // @ts-ignore
    let distance = null
    // @ts-ignore
    let pace = null

    run.summaries.forEach(summary => {
        // @ts-ignore
        if (summary.metricType === "distance" && distance === null) {
            distance = Number(summary.value.toFixed(2)) // Assuming you want to round to 2 decimal places
        //     @ts-ignore
        } else if (summary.metricType === "pace" && pace === null) {
            const paceSeconds = Math.round(summary.value * 60) // Convert pace to seconds
            const paceHours = Math.floor(paceSeconds / 3600)
            const paceMinutes = Math.floor((paceSeconds % 3600) / 60)
            const paceSec = paceSeconds % 60

            let paceFormatted = `${paceMinutes}'${paceSec < 10 ? "0" : ""}${paceSec}`
            if (paceHours > 0) {
                paceFormatted = `${paceHours}'${paceFormatted}`
            }
            pace = paceFormatted
        }
    })

    return {
        id: run.id,
        activeDuration: durationStr,
        startEpoch,
        distance, 
        pace,
    }
}

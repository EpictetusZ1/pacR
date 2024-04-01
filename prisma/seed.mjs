import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
const directoryPath = "/Users/vermilion/Documents/PacR/Ref/"

const readJsonFiles = (dir) => {
    return fs.readdirSync(dir).filter(file => file.endsWith('.json')).map(file => {
        return JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
    })
}

const Terrain = {
    road:'road',
    trail : 'trail',
    track : 'track',
    unknown : 'unknown'
}

const seed = async () => {
    const prisma = new PrismaClient()
    const runs = readJsonFiles(directoryPath)
                        .filter(run => run.type === "run")

    const runCreations = runs.map((run) => {
        const runData = {
            id: run.id,
            startEpoch: new Date(run.start_epoch_ms),
            endEpoch: new Date(run.end_epoch_ms),
            activeDurationMs: run.active_duration_ms,
            distance: run.summaries.find(summary => summary.metric === "distance").value,
            pace: run.summaries.find(summary => summary.metric === "pace").value,
            summaries: {
                create: run.summaries.map(summary => ({
                    metricType: summary.metric,
                    summary: summary.summary,
                    source: summary.source,
                    value: summary.value,
                })),
            },
            tags: {
                create: {
                    name: run.tags["com.nike.name"],
                    goalType: run.tags["com.nike.running.goaltype"],
                    originalActivityId: run.tags["com.nike.running.originalactivityid"],
                    recordingAppVersion: run.tags["com.nike.running.recordingappversion"],
                    recordingSource: run.tags["com.nike.running.recordingsource"],
                    syncAppVersion: run.tags["com.nike.running.syncappversion"],
                    syncSource: run.tags["com.nike.running.syncsource"],
                    temperature: parseFloat(run.tags["com.nike.temperature"]),
                    weather: run.tags["com.nike.weather"],
                    location: run.tags["location"],
                    note: run.tags["note"] ? run.tags["note"] : null,
                    rpe: parseInt(run.tags["rpe"]),
                    shoeId: run.tags["shoe_id"],
                    terrain: run.tags["terrain"] ? run.tags["terrain"].toLowerCase() : Terrain.unknown,
                },
            },
            moments: {
                create: run.moments.map(moment => ({
                    key: moment.key,
                    value: moment.value,
                    timestamp: new Date(moment.timestamp),
                    source: moment.source,
                })),
            },
            metrics: {
                create: run.metrics.map(metric => ({
                    type: metric.type,
                    unit: metric.unit.toUpperCase(),
                    source: metric.source,
                    values: metric.values,
                })),
            },
        }
        return prisma.run.create({ data: runData })
    })

    try {
        await prisma.$transaction(runCreations)
    } catch (error) {
        handleErrorMessage(error)
        return error
    } finally {
        await prisma.$disconnect()
    }
}

seed().then(r => {
    if (r) {
        console.log("Seed failed")
    } else {
        console.log("Seed successful")
    }
})

const handleErrorMessage = (error) => {
    const lines = error.stack.split('\n')
    const totalLines = lines.length
    if (totalLines > 80) {
        console.log(lines.slice(0, 40).join('\n'))
        console.log(lines.slice(-40).join('\n'))
    } else {
        console.log(error.stack)
        console.log(error.message)
        console.log(error)
    }
}

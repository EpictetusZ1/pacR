import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
const directoryPath = "{path to directory with json files}"

const readJsonFiles = (dir) => {
    return fs.readdirSync(dir).filter(file => file.endsWith('.json')).map(file => {
        return JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
    })
}

const seed = async () => {
    const prisma = new PrismaClient()
    const runs = readJsonFiles(directoryPath)
    const runCreations = runs.map((run) => {
        const runData = {
            id: run.id,
            app_id: run.app_id,
            startEpoch: new Date(run.start_epoch_ms),
            endEpoch: new Date(run.end_epoch_ms),
            nikeLastModified: new Date(run.last_modified),
            activeDurationMs: run.active_duration_ms,
            session: run.session,
            deleteIndicator: run.delete_indicator,
            change_tokens: run.change_tokens,
            sources: run.sources,
            summaries: {
                create: run.summaries.map(summary => ({
                    metricType: summary.metric,
                    summary: summary.summary,
                    source: summary.source,
                    appId: summary.app_id,
                    value: summary.value,
                })),
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


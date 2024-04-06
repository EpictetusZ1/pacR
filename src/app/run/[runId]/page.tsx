import { prisma } from "../../../../prisma";
import { formatDate, formatMillisecondsToTime, formatPace } from "@/utils/utils-server";


async function getRunData(runId: string): Promise<any> {
    const res = await prisma.run.findFirst({
        where: {
            id: runId
        },
        include: {
            summaries: true,
            tags: true,
            moments: true,
        }
    })
    if (!res) {
        throw new Error("Failed to fetch data")
    }
    return res
}

const Run = async ({params}: { params: { runId: string } }) => {
    const data = await getRunData(params.runId)
    const formatTags = (tagName: string | number) => {
        if (typeof tagName === "number") return tagName
        const pattern = /[_-]/g
        if (pattern.test(tagName)) return tagName.split(pattern).map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
        switch (tagName) {
            case "mean":
                return "Average"
            case "nikefuel":
                return "Nike Fuel"

            default:
                return tagName.charAt(0).toUpperCase() + tagName.slice(1)
        }
    }

    return (
        <div className="p-5 space-y-6 max-w-screen-lg">
            <h1 className="text-6xl font-black bg-gradient-to-br from-dBlue to-roseBonbon bg-clip-text text-transparent">Run Details</h1>
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">General Info</h2>
                <div
                    className="flex flex-col gap-2 text-black p-4 rounded-lg shadow">
                    <p><b>Run ID:</b> {data.id}</p>
                    <p><b>Date: </b>{formatDate(data.startEpoch)}</p>
                    <span className={"flex gap-x-3"}>
                             <p><b>Start Time: </b>{new Date(data.startEpoch).toLocaleTimeString([], {
                                 hour: '2-digit',
                                 minute: '2-digit'
                             })}</p>
                    <p><b>End Time: </b>{new Date(data.endEpoch).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</p>
                    </span>

                    <p><b>Active Duration: </b>{formatMillisecondsToTime(data.activeDurationMs)}</p>
                    <p><b>Distance:</b> {data.distance.toFixed(2)} Miles</p>
                    <p><b>Pace: </b>{formatPace(data.pace)} Mph</p>
                    <p><b>Location: </b> {data.tags.location}</p>
                    <p><b>Terrain: </b> {data.tags.terrain}</p>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.summaries.map((summary: any) => (
                        <div key={summary.id}
                             className="0 p-4 rounded-lg shadow-lg text-black">
                            <p className="font-bold">{formatTags(summary.metricType)}</p>
                            <p className="text-gray-600">{formatTags(summary.summary)}: {summary.value.toFixed(2)}</p>
                            <p className="text-gray-600 text-xs pt-3">Source: {summary.source}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">Tags</h2>
                {data.tags.name && (<p className="text-gray-700">Name: {data.tags.name}</p>)}
                {/* TODO: Add notes */}
            </div>
        </div>
    )
}

export default Run

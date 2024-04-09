import { prisma } from "../../../../prisma";
import { formatDate, formatMillisecondsToTime, formatPace, toTitleCase } from "@/utils/utils-server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Mapbox from "@/components/MapBox/MapBox";


async function getRunData(runId: string, userId: string): Promise<any> {
    const res = await prisma.run.findFirst({
        where: {
            AND: [
                {
                    id: runId
                },
                {
                    userId: userId
                }
            ]
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

const TagsComponent = ({ tags }: {tags: any}) => {
    return (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(tags).map(([key, value]) => {
                if (value !== null && value !== undefined) {
                    if (key === "id" || key === "shoeId") {
                        return null
                    }
                    return (
                        <li key={key} className={"h-auto"}>
                            <strong>{toTitleCase(key)}:</strong><p>{value.toString()}</p>
                        </li>
                    )
                }
                return null
            })}
        </ul>
    )
}

const Run = async ({params}: { params: { runId: string } }) => {
    const session = await auth()
    if (!session) {
        redirect("/api/auth/signIn")
    }
    const data = await getRunData(params.runId, session?.user?.id!)
    const formatTags = (tagName: string | number) => {
        if (typeof tagName === "number") return tagName
        switch (tagName) {
            case "mean":
                return "Average"
            case "nikefuel":
                return "Nike Fuel"
            default:
                return toTitleCase(tagName)
        }
    }

    return (
        <div className="py-16 px-5 space-y-6 h-auto">
            <h1 className="text-6xl font-black bg-gradient-to-br from-dBlue to-roseBonbon bg-clip-text text-transparent">Run Details</h1>
            <div className="flex mb-8 gap-2 w-full">
                <div className={"w-1/3"}>
                    <h2 className="text-2xl font-bold text-darkCyan-600 mb-4">General Info</h2>
                    <div className="flex flex-col gap-2 text-black p-4 rounded-lg shadow">
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

                <Mapbox/>
            </div>

            <div className={"py-4"}>
            <h2 className="text-xl font-bold text-darkCyan-600 mb-4">Metrics</h2>
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
            <div className={"mt-4"}>
                <h2 className="text-xl font-bold text-darkCyan-600 mb-4">Tags</h2>
                <TagsComponent tags={data.tags}/>
            </div>
        </div>
    )
}

export default Run

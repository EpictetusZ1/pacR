import MultiLineChart from "@/components/Charts/MultiLineChart";
import { prisma } from "../../../prisma";
import RunCard from "@/components/RunCard/RunCard";
import { SimpleRun } from "@/types/Main.types";


async function getUserRuns(): Promise<any> {
    const res = await prisma.run.findMany({
        take: 200,
        select: {
            id: true,
            activeDurationMs: true,
            distance: true,
            pace: true,
            startEpoch: true,
        },
        orderBy: {
            startEpoch: "asc",
        },
    })

    if (!res) {
        throw new Error("Failed to fetch data")
    }

    let durationData: number[] = []
    let distanceData: number[] = []
    let paceData: number[] = []
    let dates: string[] = []

    // @ts-ignore
    res.forEach((item: SimpleRun) => {
        durationData.push(Number(item.activeDurationMs))
        distanceData.push(Number(item.distance))
        paceData.push(Number(item.pace))
        dates.push(new Date(item.startEpoch).toLocaleDateString('en-US', {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }))
    })

    return {
        durationData,
        distanceData,
        paceData,
        dates
    }
}


const Dashboard = async () => {
    const data = await getUserRuns()
    return (
        <div className={"h-screen w-screen p-8"}>
            <h1 className={"text-5xl font-bold font-inter pt-0 pb-3 self-start"}>Run Data</h1>
            <div className={"flex gap-4 items-start justify-start"}>
                <MultiLineChart data={data}/>
                <RunCard />
            </div>

        </div>
    )
}

export default Dashboard

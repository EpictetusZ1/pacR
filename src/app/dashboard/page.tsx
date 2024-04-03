import MultiLineChart from "@/components/Charts/MultiLineChart";
import { prisma } from "../../../prisma";


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
    return res
}

const Dashboard = async () => {
    const data = await getUserRuns()
    return (
        <div className={"h-screen w-screen p-8 flex flex-col items-center justify-start"}>
            <h1 className={"text-5xl font-bold font-inter p-8"}>Run Data</h1>
            <MultiLineChart data={data}/>
        </div>
    )
}

export default Dashboard

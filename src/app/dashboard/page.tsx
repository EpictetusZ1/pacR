import LineChart from "@/components/Charts/LineChart";
import { SimpleRun } from "@/types/Main.types";
import { prisma } from "../../../prisma";
import { formatRunData } from "@/utils/utils-server";


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
            startEpoch: "desc",
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
        <div className={"h-screen w-screen p-8"}>
            <LineChart data={data}/>
        </div>
    )
}

export default Dashboard

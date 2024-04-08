import MultiLineChart from "@/components/Charts/MultiLineChart";
import { prisma } from "../../../prisma";
import { DateAndId, SimpleRun } from "@/types/Main.types";
import { auth } from "@/auth";
import { redirect } from 'next/navigation'



async function getUserRuns(userId: string): Promise<any> {
    const res = await prisma.run.findMany({
        where: {
            userId: userId,
        },
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
    let dateAndIds: DateAndId[] = []

    // @ts-ignore
    res.forEach((item: SimpleRun) => {
        durationData.push(Number(item.activeDurationMs))
        distanceData.push(Number(item.distance))
        paceData.push(Number(item.pace))
        dateAndIds.push({
            date: new Date(item.startEpoch).toLocaleDateString('en-US', {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            id: item.id
        })
    })

    return {
        durationData,
        distanceData,
        paceData,
        dateAndIds
    }
}


const Dashboard = async () => {
    const session = await auth()
    if (!session) {
        redirect("/api/auth/signIn")
    }
    const data = await getUserRuns(session?.user?.id!)
    return (
        <div className={"h-screen w-screen p-8"}>
            <h1 className={"text-5xl font-bold font-inter pt-0 pb-3 self-start"}>Run Data</h1>
            <div className={"flex gap-4 items-start justify-start"}>
                <MultiLineChart data={data}/>
            </div>

        </div>
    )
}

export default Dashboard

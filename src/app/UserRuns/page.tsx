import { prisma } from "../../../prisma";
import { formatRunData } from "@/utils/utils-server";
import RunTable from "@/components/RunTable/RunTable";


async function getUserRuns() {
    const res = await prisma.run.findMany({
        select: {
            id: true,
            activeDurationMs: true,
            startEpoch: true,
            summaries: {
                where: {
                    OR: [
                        { metricType: "distance" },
                        { metricType: "pace" }
                    ]
                },
                select: {
                    metricType: true,
                    value: true,
                },
            },
        },
    })

    if (!res) {
        throw new Error("Failed to fetch data")
    }

    const firstTwoRuns = res.slice(0, 2)

    return firstTwoRuns.map(run => formatRunData(run))
}

const UserRuns = async () => {
    const userRuns = await getUserRuns()
    return (
        <div className={"p-5 h-screen w-screen contain-content flex flex-col content-center justify-center items-center"}>
            <div className="relative overflow-x-auto">
                <RunTable runs={userRuns} />
            </div>
        </div>
    )
}

export default UserRuns

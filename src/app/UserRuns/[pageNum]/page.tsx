import { prisma } from "../../../../prisma";
import Link from "next/link";
import { formatRunData } from "@/utils/utils-server";
import RunTable from "@/components/RunTable/RunTable";


async function getUserRuns(pageNum: number) {
    const res = await prisma.run.findMany({
        skip: pageNum * 20,
        take: 20,
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

    return res.map(run => formatRunData(run))
}

const UserRuns = async ({ params }: { params: { pageNum: number} }) => {
    const userRuns = await getUserRuns(params.pageNum)

    return (
        <div className={"p-5 h-screen w-screen contain-content flex flex-col content-center justify-center items-center"}>
            <div className="relative overflow-x-auto">
                <RunTable runs={userRuns} />
            </div>
            <div className="flex justify-center space-x-2">
                {params.pageNum > 1 && (
                    <Link href={`/UserRuns/${params.pageNum - 1}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Previous Page
                    </Link>
                )}
                <Link href={`/UserRuns/${params.pageNum + 1}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Next Page
                </Link>
            </div>


        </div>
    )
}

export default UserRuns

import { prisma } from "../../../../prisma";
import Link from "next/link";
import { formatRunData } from "@/utils/utils-server";
import RunTable from "@/components/RunTable/RunTable";
import { SimpleRun } from "@/types/Main.types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";


async function getUserRuns(pageNum: number, userId: string): Promise<SimpleRun[]> {
    // Might add count later
    const res = await prisma.run.findMany({
        where: {
            userId: userId,
        },
        skip: pageNum * 20,
        take: 20,
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

    return res.map(run => formatRunData(run))
}

const UserRuns = async ({ params }: { params: { pageNum: string} }) => {
    const session = await auth()
    if (!session) {
        redirect("/api/auth/signIn")
    }

    const pageNum = parseInt(params.pageNum, 10)
    const userRuns = await getUserRuns(pageNum, session?.user?.id!)

    return (
        <div className={"p-5 h-screen w-screen contain-content flex flex-col content-center justify-start items-center"}>
            <h1 className={"text-4xl font-bold p-4"}>Your Runs:</h1>
            {/*<div className="relative overflow-hidden rounded-2xl">*/}
                <RunTable runs={userRuns} />
            {/*</div>*/}
            <div className="w-80 h-12 px-1 flex gap-1 justify-between space-x-2 relative">
                {pageNum > 1 && (
                    <Link href={`/userRuns/${pageNum - 1}`} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l absolute bottom-0 left-0">
                        Previous
                    </Link>
                )}
                <Link href={`/userRuns/${pageNum + 1}`} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r absolute bottom-0 right-0">
                    Next
                </Link>
            </div>
        </div>
    )
}

export default UserRuns

import { prisma } from "../../../../prisma";


async function getRunData(runId: string): Promise<any> {
    const res = await prisma.run.findFirst({
        where: {
            id: runId
        },
        include: {
            summaries: true,
            tags: true,
            metrics: true,
            moments: true,
        }
    })
    if (!res) {
        throw new Error("Failed to fetch data")
    }
    return res
}

//  const UserRuns = async ({ params }: { params: { pageNum: string} }) => {
const Run = async ({ params }: { params: { runId: string }}) => {
    console.log(params)
    const data = await getRunData(params.runId)
    console.log(data)

    return (
        <div>

        </div>
    );
};

export default Run

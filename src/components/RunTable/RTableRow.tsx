import { SimpleRun } from "@/types/Main.types";


const RTableRow = ({run}: {run: SimpleRun}) => {
    // Re-write this and maybe convert ALL numbers to regular numbers in JS.
    const toMinutes = (ms: bigint) => Number(ms) / 60000;


    return (
        <tr className={"max-w-full"}>
            <td>{toMinutes(run.activeDurationMs)}</td>
            {/*{Object.entries(run.tags).map(([key, value], index) => (*/}
            {/*    // @ts-ignore*/}
            {/*    key !== "id" && <td key={index}>{value}</td>*/}
            {/*))}*/}
            <td>
                <table>
                    <thead className={"p-10"}>
                    <tr className={"flex gap-2"}>

                        <th>Calories</th>
                    </tr>
                    </thead>
                    <tbody>
                        {run.summaries.map((summary, index) => (
                            <tr key={index}>

                            </tr>
                        ))}

                    </tbody>

                </table>
            </td>


        </tr>
    );
};

export default RTableRow;
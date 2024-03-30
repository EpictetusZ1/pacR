"use client"
import { SimpleRun } from "@/types/Main.types";
import RTableRow from "@/components/RunTable/RTableRow";


const RunTable = ({runs}: {runs: SimpleRun[]}) => {
    console.log(runs[0])
    return (
        <table className={"table max-w-screen-lg"}>
            <thead className={"max-w-screen-lg"}>
            <tr className={"max-w-screen-lg"}>
                <th>Active Duration</th>
                <th>Tags</th>
                <th>Summaries</th>
            </tr>
            </thead>
            <tbody className={"flex max-w-screen-lg"}>
                {runs.map((run) => <RTableRow key={run.id} run={run} /> )}
            </tbody>



        </table>
    );
};

export default RunTable;

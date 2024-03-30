"use client"
import { SimpleRun } from "@/types/Main.types";
import RTableRow from "@/components/RunTable/RTableRow";


const RunTable = ({runs}: {runs: SimpleRun[]}) => {
    console.dir(runs[0])
    return (
        <table className={"table"}>
            <thead>
            <tr>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Active Duration</th>
                <th>Last Modified</th>
                <th>Tags</th>
            </tr>
            </thead>
            <tbody>
                {runs.map((run) => <RTableRow key={run.id} run={run} /> )}
            </tbody>



        </table>
    );
};

export default RunTable;

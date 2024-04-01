"use client"
import { SimpleRun } from "@/types/Main.types";
import RTableRow from "@/components/RunTable/RTableRow";


const RunTable = ({runs}: {runs: SimpleRun[]}) => {
    return (
        <table className={"-mb-1"}>
            <thead className={"text-sm text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"}>
            <tr className={"text-sm"}>
                <th scope="col" >Date</th>
                <th scope="col" >Distance</th>
                <th scope="col" >Duration</th>
                <th scope="col" >Pace</th>
            </tr>
            </thead>
            <tbody className={""}>
                {runs.map((run) => <RTableRow key={run.id} run={run} /> )}
            </tbody>
        </table>
    )
}

export default RunTable;

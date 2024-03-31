"use client"
import { SimpleRun } from "@/types/Main.types";
import RTableRow from "@/components/RunTable/RTableRow";


const RunTable = ({runs}: {runs: SimpleRun[]}) => {
    return (
        <table>
            <thead className={"text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"}>
            <tr>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Distance</th>
                <th scope="col" className="px-6 py-3">Duration</th>
                <th scope="col" className="px-6 py-3">Pace</th>
            </tr>
            </thead>
            <tbody className={""}>
                {runs.map((run) => <RTableRow key={run.id} run={run} /> )}
            </tbody>
        </table>
    )
}

export default RunTable;

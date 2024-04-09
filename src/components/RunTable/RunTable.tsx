"use client"
import { SimpleRun } from "@/types/Main.types";
import RTableRow from "@/components/RunTable/RTableRow";
import { useState } from "react";
import RunCard from "@/components/RunCard/RunCard";


const RunTable = ({runs, className, cardStyle}: {runs: SimpleRun[], className: string, cardStyle: string}) => {
    const [currRun, setCurrRun] = useState<SimpleRun | null>(null)
    return (
        <>
            <div className={className}>
                <table>
                    <thead className={"text-sm text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"}>
                    <tr className={"text-sm"}>
                        <th scope="col">Date</th>
                        <th scope="col">Distance</th>
                        <th scope="col">Duration</th>
                        <th scope="col">Pace</th>
                    </tr>
                    </thead>
                    <tbody>
                    {runs.map((run) => <RTableRow key={run.id} run={run}
                                                  onClick={() => {
                                                      const clickedRun = runs.find((r) => r.id === run.id)
                                                      clickedRun && setCurrRun(clickedRun)
                                                  }}
                    />)}
                    </tbody>
                </table>
            </div>
            {currRun && <RunCard run={currRun} formatted={true} className={cardStyle}/>}
        </>
    )
}

export default RunTable

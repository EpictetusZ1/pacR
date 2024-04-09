"use client"
import { formatMillisecondsToTime, formatPace } from "@/utils/utils-server";
import { useRouter } from "next/navigation";


// TODO: Create some optional UI to show all details that are possibly available, like heart rate, calories, etc.
const RunCard = ({run, formatted, className}: {run: any, className?: string, formatted?: boolean}) => {
    const router = useRouter()

    const getValues = (run: any) => {
        if (formatted) {
            return {
                distance: run.distance,
                activeDurationMs: run.activeDurationMs,
                pace: run.pace,
                startEpoch: run.startEpoch
            }
        } else {
            return {
                distance: run.distance.toFixed(2),
                activeDurationMs: formatMillisecondsToTime(run.activeDurationMs),
                pace: formatPace(run.pace),
                startEpoch: new Date(run.startEpoch).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                })
            }
        }
    }

    let {distance, activeDurationMs, pace, startEpoch} = getValues(run)
    return (
        <div
            onClick={() => router.push(`/run/${run.id}`)}
            className={className ? className: " w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700"}>
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">{startEpoch}</h5>
            <div className="flex items-baseline text-gray-900 dark:text-white">
                <span className="text-5xl font-extrabold tracking-tight">{distance}</span>
                <span className="text-3xl font-semibold">&nbsp; miles</span>
            </div>
            <ul role="list" className="space-y-5 my-7">
            <li className="flex items-center">
                    <svg className="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                    </svg>
                    <span
                        className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">Duration: {activeDurationMs}</span>
                </li>
                <li className="flex">
                    <svg className="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                    </svg>
                    <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">Pace: {pace}</span>
                </li>
            </ul>
            <button type="button"
                    className="text-white bg-darkCyan-500 hover:bg-darkCyan-400 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">
                View Details
            </button>
        </div>
    )
}

export default RunCard

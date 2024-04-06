import { MouseEvent } from "react";


const RTableRow = ({run, onClick}: {run: any, onClick: (e:  MouseEvent<HTMLTableRowElement>) => void}) => {
    return (
        <tr className={"bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-center"} onClick={onClick}>
            <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white text-sm">{run.startEpoch}</th>
            <td className={"text-sm px-6 py-2"}>{run.distance}</td>
            <td className={"text-sm px-6 py-2"}>{run.activeDurationMs}</td>
            <td className={"text-sm px-6 py-2"}>{run.pace}</td>
        </tr>
    )
}

export default RTableRow



const RTableRow = ({run}: {run: any}) => {
    return (
        <tr className={"bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-center"}>
            <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{run.startEpoch}</th>
            <td className={"px-6 py-2"}>{run.distance}</td>
            <td className={"px-6 py-2"}>{run.activeDurationMs}</td>
            <td className={"px-6 py-2"}>{run.pace}</td>
        </tr>
    )
}

export default RTableRow

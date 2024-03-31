

const RTableRow = ({run}: {run: any}) => {
    return (
        <tr className={"bg-white border-b dark:bg-gray-800 dark:border-gray-700"}>
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{run.startEpoch}</th>
            <td className={"px-6 py-4"}>{run.distance}</td>
            <td className={"px-6 py-4"}>{run.activeDuration}</td>
            <td className={"px-6 py-4"}>{run.pace}</td>
        </tr>
    )
}

export default RTableRow

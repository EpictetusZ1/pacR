import { SimpleRun } from "@/types/Main.types";


const RTableRow = ({run}: {run: SimpleRun}) => {
    return (
        <tr>
            <td>{run.startEpoch.toString()}</td>
            <td>{run.endEpoch.toString()}</td>
            <td>{run.activeDurationMs.toString()}</td>
            <td>{run.nikeLastModified.toString()}</td>
            {Object.entries(run.tags).map(([key, value], index) => (
                // @ts-ignore
                key !== "id" && <td key={index}>{value}</td>
            ))}



            
        </tr>
    );
};

export default RTableRow;
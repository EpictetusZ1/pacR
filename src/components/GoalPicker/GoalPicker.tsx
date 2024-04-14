"use client"
import { useState, } from "react";
import { GoalType } from "@/types/Main.types";


interface GoalConfig {
    type: GoalType
    description: string
}

interface DistanceValues {
    name: string
    miles: number
    kilometers: number
}

// TODO: Convert this into a modal
const DefineGoal = ({goalType}: {goalType: GoalType}) => {
    const [description, setDescription] = useState<string>("")
    const [metric, setMetric] = useState<string>("")
    const [frequency, setFrequency] = useState<string>("")
    const [subGoalSelected, setSubGoalSelected] = useState<boolean>(false)
    const [subGoal, setSubGoal] = useState<string>(" ")
    const [prefUnits, setPrefUnits] = useState<string>("miles")
    // set all distance values form 1k to ultra
    const [distanceValues, setDistanceValues] = useState<DistanceValues[]>([
        {name: "1k", miles: 0.621371, kilometers: 1},
        {name: "5k", miles: 3.10686, kilometers: 5},
        {name: "10k", miles: 6.21371, kilometers: 10},
        {name: "Half Marathon", miles: 13.1, kilometers: 21.0826},
        {name: "Marathon", miles: 26.2, kilometers: 42.195},
        {name: "50k", miles: 31.0686, kilometers: 50},
        {name: "100k", miles: 62.1371, kilometers: 100},
        {name: "100 miles", miles: 100, kilometers: 160.934},
        {name: "Ultra", miles: 100, kilometers: 160.934}
    ])


    // GOAL DEFINER
    // for Outcome
    // have a radio for outcome type: distance, race, time
    // have a line of text that says run X in Y time
    // or run a X by Y date

    // for Performance
    // have a radio for performance
    // have a line of text that says improve X by Y
    // for Process
    // have a line of text that says run X times per week
    // or run X times per month
    // or run X times per year
    // or run X times per day
    // Current data - data which to send to api
    // date picker for start date, end date
    return (
        <div className="flex flex-col items-center p-4 space-y-4">
            {goalType === "Outcome" && (
                <>
                    <span className={"inline-flex items-center font-semibold text-xl"}>
                    I would like to run a: &nbsp;
                        <select className={"border-2 rounded py-1 px-2 text-darkCyan-500 text-center"}
                                name="subGoalId"
                                value={subGoal}
                                onChange={e => {
                                    setSubGoal(e.target.value)
                                    setSubGoalSelected(true)
                                }}
                        >
                        <option value=" "></option>
                        <option value="distance">Distance</option>
                        <option value="race">Race</option>
                        <option value="time">Time</option>
                    </select>
                </span>
                    {subGoalSelected && (
                        <span>
                            <>
                                {/*TODO: Need another input */}
                                <span className={"inline-flex gap-2 items-center py-2"}>
                                    <>
                                        <input type="radio" name="distance" value="miles"
                                               onClick={() => setPrefUnits("miles")}/>
                                        <label>Miles</label>
                                    </>
                                    <>
                                        <input type="radio" name="distance" value="kilometers"
                                               onClick={() => setPrefUnits("kilometers")}/>
                                        <label>Kilometers</label>
                                    </>
                                </span>
                                  <hr className={"border-t-2 border-charcoal w-full py-1"}/>
                            </>
                            <div className={"flex flex-col gap-2"}>
                                {distanceValues.map((distanceValue) => (
                                    <div key={distanceValue.name} className={"text-lg"}>
                                        <input type="radio" name="distance" value={distanceValue.name}
                                               onClick={() => setMetric(distanceValue.name)}
                                        />
                                        <label className={"px-2"}>{distanceValue.name}</label>
                                    </div>
                                ))}
                            </div>
                        </span>
                    )}
                </>
            )}
            {goalType === "Performance" && (
                <div>
                    <input
                        type="text"
                        placeholder="Improve"
                        value={metric}
                        onChange={e => setMetric(e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                    />
                    <input
                        type="text"
                        placeholder="by Y amount"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                    />
                </div>
            )}
            {goalType === "Process" && (
                <div>
                    <input
                        type="text"
                        placeholder="Run X times"
                        value={metric}
                        onChange={e => setMetric(e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                    />
                    <select
                        value={frequency}
                        onChange={e => setFrequency(e.target.value)}
                        className="select select-bordered w-full max-w-xs"
                    >
                        <option disabled>Select frequency</option>
                        <option value="per week">per week</option>
                        <option value="per month">per month</option>
                        <option value="per year">per year</option>
                        <option value="per day">per day</option>
                    </select>
                </div>
            )}
        </div>
    );
};


const GoalPicker = () => {
    const [goalSelected, setGoalSelected] = useState<GoalType>()
    const [showGoalTypes, setShowGoalTypes] = useState<boolean>(false)
    const goalTypes: GoalType[] = ["Process", "Performance", "Outcome"]




    return (
        <div>
            <div className="flex justify-center items-center gap-2 p-4">
                {!showGoalTypes ? (
                    <button
                        className="px-4 py-2 rounded bg-atomic-400 text-white font-bold hover:bg-atomic-500 transition duration-300"
                        onClick={() => setShowGoalTypes(true)}
                    >
                        Pick a Goal
                    </button>
                ) : (
                    goalTypes.map((goalType) => (
                        <button
                            key={goalType}
                            className="px-4 py-2 rounded bg-atomic-500 text-white font-bold hover:bg-atomic-600 transition duration-300"
                            onClick={() => {
                                setGoalSelected(goalType);
                                // setShowGoalTypes(false);
                            }}>
                            {goalType}
                        </button>
                    ))
                )}
            </div>
            {goalSelected && <DefineGoal goalType={goalSelected}/>}
        </div>
    );
}

export default GoalPicker

// <div>
//     <input
//         type="text"
//         placeholder="Run"
//         value={metric}
//         onChange={e => setMetric(e.target.value)}
//         className="input input-bordered w-full max-w-xs"
//     />
//     <input
//         type="text"
//         placeholder="in Y time or by Y date"
//         value={description}
//         onChange={e => setDescription(e.target.value)}
//         className="input input-bordered w-full max-w-xs"
//     />
// </div>
"use client"
import { SetStateAction, useRef, useState, ChangeEvent, useEffect, } from "react";
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

interface SelectProps {
    value: string;
    options: Array<{ value: string; label: string }>
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void
    placeholder: string
}

interface PerformanceGoalMetrics {
    time: number
    distance: number
    speed: number
    distanceMetric: "miles" | "kilometers"
    completionDate?: string
}

type TAChangeEvent = { target: { value: SetStateAction<string> } }

const DateInput = ({label, onChange}: { label: string, onChange: (e: any) => any }) => {
    return (
        <div className="inline-flex items-center font-semibold text-xl">
            <label>{label}&nbsp;</label>
            <input type="date" onChange={onChange} className="border-2 rounded p-1 text-darkCyan-500 text-center"/>
        </div>
    )
}


const Select = ({value, options, onChange, placeholder}: SelectProps) => (
    <select className="border-2 rounded py-1 px-2 text-darkCyan-500 text-center" onChange={onChange} value={value}>
        <option value="">{placeholder}</option>
        {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
        ))}
    </select>
)

const distances: DistanceValues[] = [
    {name: "1k", miles: 0.621371, kilometers: 1},
    {name: "5k", miles: 3.10686, kilometers: 5},
    {name: "10k", miles: 6.21371, kilometers: 10},
    {name: "Half Marathon", miles: 13.1, kilometers: 21.0826},
    {name: "Marathon", miles: 26.2, kilometers: 42.195},
    {name: "50k", miles: 31.0686, kilometers: 50},
    {name: "100k", miles: 62.1371, kilometers: 100},
    {name: "100 miles", miles: 100, kilometers: 160.934},
]

const DistanceSelect = ({onChange}: { onChange: (e: TAChangeEvent) => void }) => {
    return (
        <select className="border-2 rounded py-1 px-2 text-darkCyan-500 text-center" onChange={onChange}>
            {distances.map((distance) => (
                <option key={distance.name} value={distance.name}>{distance.name}</option>
            ))}
        </select>
    )
}

const paceUnits = [
    { value: 0, units: "mile", label: "per Mile" },
    { value: 0, units: "km", label: "per Kilometer" },
]

const performanceGoalTypes = [
    { value: "time", label: "Time" },
    { value: "distance", label: "Distance" },
    { value: "speed", label: "Speed" },
]



const initTimeGoal = {
    time: 0,
    distance: 0,
    distanceMetric: "miles",
}

interface PerformanceGoalProps {
    metric: string
    value: string
    unit: string
    onMetChange: (e: TAChangeEvent) => void
    onValueChange: (e: TAChangeEvent) => void
    onUnitChange: (e: TAChangeEvent) => void
}
const PerformanceGoal = ({ metric, value, unit, onMetChange, onValueChange, onUnitChange }: PerformanceGoalProps) => {
    const [timeGoal, setTimeGoal] = useState(initTimeGoal)
    const [unitOptions, setUnitOptions] = useState(paceUnits)

    useEffect(() => {
        switch (metric) {
            case "time":
                // timeGoal has two properties: time, and distance
                break;
            case "pace":

                break;
            default:
                setUnitOptions([]);
        }
    }, [metric]);

    return (
        <div className="flex flex-col items-center p-4 space-y-4">
            <span className="inline-flex items-center font-semibold text-xl">
                I would like to improve my &nbsp;
                <Select
                    options={performanceGoalTypes}
                    onChange={onMetChange}
                    placeholder="Select Metric"
                    value={metric}
                />
            </span>
            {metric && (
                <>
                    <input
                        type="text"
                        placeholder={`Enter your target ${metric}`}
                        value={value}
                        onChange={onValueChange}
                        className="border-2 rounded py-1 px-2 text-darkCyan-500 text-center"
                    />
                    {unitOptions.length > 0 && (
                        <span className="inline-flex items-center font-semibold text-xl">
                            in &nbsp;
                            <Select
                                options={[...unitOptions.map((unit) => ({ value: unit.units, label: unit.label }))]}
                                onChange={onUnitChange}
                                placeholder={`Select Unit for ${metric}`}
                                value={unit}
                            />
                        </span>
                    )}
                </>
            )}
        </div>
    );
};

const DefinePerformanceGoal = () => {
    const [metric, setMetric] = useState("")
    const [value, setValue] = useState("")
    const [unit, setUnit] = useState("")

    const handleMetricChange = (e: TAChangeEvent) => setMetric(e.target.value)
    const handleValueChange = (e: TAChangeEvent) => setValue(e.target.value)
    const handleUnitChange = (e: TAChangeEvent) => setUnit(e.target.value)

    return (
        <PerformanceGoal
            metric={metric}
            value={value}
            unit={unit}
            onMetChange={handleMetricChange}
            onValueChange={handleValueChange}
            onUnitChange={handleUnitChange}
        />
    );
};
// const PerformanceGoal = ({ metric, description, onMetricChange, onDescriptionChange }: PerformanceGoalProps) => {
//     return (
//         <div>
//             <div className="flex flex-col items-center p-4 space-y-4">
//                 <span className={"inline-flex items-center font-semibold text-xl"}>
//                     I would like to improve my &nbsp;
//                     <Select options={[
//                         {value: "time", label: "Time"},
//                         {value: "distance", label: "Distance"},
//                         {value: "speed", label: "Speed"}
//                     ]}
//                             onChange={onMetricChange}
//                             placeholder=" "
//                             value={metric}
//                     />
//                 </span>
//                 <input type="text" value={description} onChange={onDescriptionChange} className="border-2 rounded py-1 px-2 text-darkCyan-500 text-center" placeholder="by Y amount" />
//             </div>
//         </div>
//
//     )
// }



const DefineGoal = ({goalType}: { goalType: GoalType }) => {
    const [date, setDate] = useState("")
    const [distance, setDistance] = useState("")
    const [subGoal, setSubGoal] = useState("")
    const [metric, setMetric] = useState("")
    const [description, setDescription] = useState("")
    const [useDate, setUseDate] = useState(false)

    const handleDistanceChange = (e: TAChangeEvent) => setDistance(e.target.value)
    const handleDateChange = (e: TAChangeEvent) => setDate(e.target.value)
    const handleSubGoalChange = (e: TAChangeEvent) => setSubGoal(e.target.value)
    const handleMetricChange = (e: TAChangeEvent) => setMetric(e.target.value)
    const handleDescriptionChange = (e: TAChangeEvent) => setDescription(e.target.value)
    const toggleDateUsage = (e: TAChangeEvent) => setUseDate( e.target.value === "true")

    return (
        <div className="flex flex-col items-center p-4 space-y-4">
            {goalType === "Outcome" && (
                <>
                    <span className={"inline-flex items-center font-semibold text-xl"}>
                        I would like to run a &nbsp;
                        <Select options={[
                            {value: "distance", label: "Distance"},
                            {value: "race", label: "Race"},
                            {value: "time", label: "Time"}
                        ]}
                                onChange={handleSubGoalChange}
                                placeholder=" "
                                value={subGoal}
                        />
                    </span>
                    {subGoal === "distance" && (
                        <>
                            <span className="inline-flex items-center font-semibold text-xl">
                                of &nbsp;
                                <DistanceSelect onChange={handleDistanceChange}/>
                            </span>
                            <span className={"flex items-center"}>
                                <input id="radio-1" type="radio" value="false" name="useDate"
                                       onChange={toggleDateUsage}
                                       className={"w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"}/>
                                <label htmlFor="radio-1" className="mx-2 text-gray-500">Anytime</label>
                                <input id="radio-2" type="radio" value="true" name="useDate"
                                       onChange={toggleDateUsage}
                                       className={"w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"}/>
                                <label htmlFor="radio-2" className="ml-1 text-gray-500">By a specific date</label>
                            </span>
                            {useDate && (
                                <DateInput label="by" onChange={handleDateChange}/>
                            )}
                        </>
                    )}
                </>
            )}
            {goalType === "Performance" && (
                <DefinePerformanceGoal />
            )}
        </div>
    )
}


const GoalPicker = () => {
    const [goalSelected, setGoalSelected] = useState<GoalType>()
    const [showGoalTypes, setShowGoalTypes] = useState<boolean>(false)
    const goalTypes: GoalType[] = ["Performance", "Outcome"]

    return (
        <div>
            <div className="flex justify-center items-center gap-2 p-4">
                {!showGoalTypes ? (
                    <button
                        className="px-4 py-2 rounded bg-atomic-300 text-black font-bold hover:bg-atomic-500 transition duration-300"
                        onClick={() => setShowGoalTypes(true)}
                    >
                        Pick a Goal
                    </button>
                ) : (
                    goalTypes.map((goalType) => (
                        <button
                            key={goalType}
                            className="px-4 py-2 rounded bg-atomic-400 text-white font-bold hover:bg-atomic-500 transition duration-300"
                            onClick={() => {
                                setGoalSelected(goalType)
                            }}>
                            {goalType}
                        </button>
                    ))
                )}
            </div>
            {goalSelected && <DefineGoal goalType={goalSelected}/>}
        </div>
    )
}

export default GoalPicker

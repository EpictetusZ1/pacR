"use client"
import { SetStateAction, useRef, useState, ChangeEvent, useEffect, } from "react"
import { GoalType, Goal, SubGoalType, SubGoal } from "@/types/Main.types"
import { useGoalStore } from "@/store/goal";


interface DistanceValues {
    name: string
    miles: number
    kilometers: number
}

interface SelectProps {
    value: string
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
    {name: "1 mile", miles: 1, kilometers: 1.60934},
    {name: "5k", miles: 3.10686, kilometers: 5},
    {name: "10k", miles: 6.21371, kilometers: 10},
    {name: "15k", miles: 9.32057, kilometers: 15},
    {name: "10 miles", miles: 10, kilometers: 16.0934},
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
    { value: "Time", label: "Time" },
    { value: "Distance", label: "Distance" },
    { value: "Speed", label: "Speed" },
]

interface PerformanceGoalProps {
    metric: string
    value: string
    unit: string
    onMetChange: (e: TAChangeEvent) => void
    onValueChange: (e: TAChangeEvent) => void
    onUnitChange: (e: TAChangeEvent) => void
}

interface Time {
    hours: number
    minutes: number
    seconds: number
}

const timeUnits = ["hours", "minutes", "seconds"]

const TimeInput = ({ time, setTime }:  {time: Time, setTime: any }) => (
    timeUnits.map(unit => (
        <Select
            key={unit}
            value={time[unit as keyof Time].toString()}
            onChange={e => setTime({ ...time, [unit]: parseInt(e.target.value) })}
            options={Array.from({ length: unit === "hours" ? 24 : 60 }, (_, i) => ({ value: i.toString(), label: `${i} ${unit}` }))}
            placeholder={`0 ${unit}`}
        />
    ))
)

const getTimeString = (hours: number, minutes: number, seconds: number) => {
    const pad = (num: number) => String(num).padStart(2, "0")
    return `${hours}:${pad(minutes)}:${pad(seconds)}`
}

const initGoalTime = {
    hours: 0,
    minutes: 0,
    seconds: 0,
}

interface DefinerProps {
    goal: Goal
}

// convert hours min seconds to epoch ms
const timeToEpoch = (time: Time) => {
    const { hours, minutes, seconds } = time
    return (hours * 60 * 60 + minutes * 60 + seconds) * 1000
}

const PerformanceGoal = () => {
    const subGoal = useGoalStore(state => state.getSGoal())!
    // const [targetDistance, setTargetDistance] = useState("")
    // const [goalTime, setGoalTime] = useState<Time>(initGoalTime)
    // const [paceUnit, setPaceUnit] = useState("mile")

    // const handlePaceUnitChange = (e: TAChangeEvent) => setPaceUnit(e.target.value)
    // const onTargetDistanceChange = (e: TAChangeEvent) => setTargetDistance(e.target.value)

    const updateSubGoal = useGoalStore(state => state.updateSubGoal)
    const updateGoalDate = useGoalStore(state => state.updateOutcomeGoalDate)

    // const handleUpdateSubGoal = (value: any) => {
    //     if (subGoal.type === "Time") {
    //         updateSubGoal({ type: "Time", value: timeToEpoch(goalTime) })
    //     } else if (subGoal.type === "Distance") {
    //         updateSubGoal({ type: "Distance", value: distances.find(distance => distance.name === targetDistance)!.miles })
    //     } else if (subGoal.type === "Speed") {
    //         updateSubGoal({ type: "Speed", value: parseFloat(value), unit: paceUnit === "miles" ? "mi/h" : "km/h" })
    //     }
    // }

    const paceOptions = [
        {
            value: "mile",
            units: "mi/h",
            label: "per Mile"
        },
        {
            value: "km",
            units: "km/h",
            label: "per Kilometer"
        }
    ]

    return (
        <div className="flex flex-col items-center p-4 space-y-4">
            <span className="inline-flex items-center font-semibold text-xl">
                I would like to improve my &nbsp;
                <Select
                    options={performanceGoalTypes}
                    onChange={(e) => updateSubGoal({ type: e.target.value as SubGoalType, value: 0 })}
                    placeholder="Select Metric"
                    value={subGoal.type}
                />
            </span>
            {(subGoal.type !== "Unset") && (
                <>
                    {subGoal.type !== "Speed" && (
                        <>
                            <span className="inline-flex items-center font-semibold text-xl">
                               In &nbsp;
                                <Select
                                    options={distances.map((distance) => ({
                                        value: distance.name,
                                        label: distance.name
                                    }))}
                                    onChange={(e) => updateSubGoal({ type: "Distance", value: distances.find(distance => distance.name === e.target.value)!.miles })}
                                    placeholder={"Select Distance"}
                                    value={targetDistance}
                                />
                            </span>
                            <span className="inline-flex gap-x-3 items-center font-semibold text-xl">
                                in &nbsp;
                                <TimeInput time={goalTime} setTime={(e) => updateSubGoal({type: "Time", value: timeToEpoch(e.target.value)})}/>
                            </span>
                            <span className={"flex items-center gap-x-2 border-2 px-4 py-2 border-black rounded"}>
                                Target Goal Time:
                                 <p className={"font-semibold text-center border-2 px-4 py-2 rounded"}>
                                     {getTimeString(goalTime.hours, goalTime.minutes, goalTime.seconds)}
                                 </p>
                            </span>
                        </>
                    )}
                    {subGoal.type === "Speed" && (
                        <>
                            <div className="inline-flex items-center font-semibold text-xl">
                                Pace &nbsp;
                                <Select value={paceUnit} options={paceOptions} onChange={handlePaceUnitChange}
                                        placeholder={"miles"}/>
                            </div>
                            <div className="inline-flex items-center font-semibold text-xl  gap-x-2">
                                Of &nbsp;
                                <TimeInput time={goalTime} setTime={setGoalTime}/>
                            </div>
                            <div>
                                <DateInput label={"By"} onChange={(e) => updateGoalDate(e.target.value)} />
                            </div>
                        </>

                    )}

                </>
            )}
        </div>
    )
}

const DefineOutcomeGoal = ({ goal }: DefinerProps) => {
    const [date, setDate] = useState("")
    const [distance, setDistance] = useState("")
    const [useDate, setUseDate] = useState(false)

    const handleDistanceChange = (e: TAChangeEvent) => setDistance(e.target.value)
    const handleDateChange = (e: TAChangeEvent) => setDate(e.target.value)
    const toggleDateUsage = (e: TAChangeEvent) => setUseDate( e.target.value === "true")

    const setSubGoalType = useGoalStore(state => state.setSubGoalType)

    return (
        <>
            <span className={"inline-flex items-center font-semibold text-xl"}>
                I would like to run a &nbsp;
                <Select options={[
                    {value: "Distance", label: "Distance"},
                    {value: "Time", label: "Time"}
                ]}
                        onChange={(e) => setSubGoalType(e.target.value)}
                        placeholder=" "
                        value={goal.sGoalType!}
                />
            </span>
            {goal.sGoalSet && (
                <>
                    {goal.sGoalType === "Distance" && (
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
        </>
    )
}


const GoalPicker = () => {
    const [showGoalTypes, setShowGoalTypes] = useState<boolean>(false)
    const goalTypes: GoalType[] = ["Performance", "Outcome"]
    const goal = useGoalStore(state => state.getGoal())
    const subGoal = useGoalStore(state => state.getSGoal())
    const setGoalType = useGoalStore(state => state.setGoalType)

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
                            onClick={() => setGoalType(goalType)}>
                            {goalType}
                        </button>
                    ))
                )}
            </div>
            {goal && goal.goalSet && (
                <div className="flex flex-col items-center p-4 space-y-4">
                    {goal.type === "Outcome" && goal && <DefineOutcomeGoal goal={goal}  /> }
                    {goal.type === "Performance" && goal && <PerformanceGoal /> }
                </div>
            )}
        </div>
    )
}

export default GoalPicker

import { useState } from "react"
import { BaseGoal, GoalType, Goal, PerformanceGoal, OutcomeGoal, SubGoal } from "@/types/Main.types";


const useGoalManager = () => {
    const [goal, setGoal] = useState<Goal | null>(null)

    const updateGoal = (updates: Goal) => {
        setGoal((prevGoal) => {
            if (!prevGoal) {
                return null
            }
            return { ...prevGoal, ...updates }
        })
    }

    const setGoalType = (type: GoalType, baseInfo: BaseGoal) => {
        if (type === "Performance") {
            setGoal({ ...baseInfo, type: "Performance", subGoals: {}, subGoalType: "Distance", subGoalSet: false } as PerformanceGoal)
        } else if (type === "Outcome") {
            setGoal({ ...baseInfo, type: "Outcome", date: new Date(), subGoals: {}, subGoalType: "Distance", subGoalSet: false } as OutcomeGoal)
        }
    }

    const setSubGoalType = (subGoalType: "Time" | "Distance" | "Speed") => {
        if (goal?.type === "Performance") {
            updateGoal({...goal, subGoalType: subGoalType, subGoalSet: true})
        } else if (goal?.type === "Outcome" && subGoalType !== "Speed") {
            updateGoal({...goal, subGoalType: subGoalType, subGoalSet: true})
        }
    }

    const setSubGoal = (subGoal: SubGoal) => {
        console.log("implement me")
    }

    const methods = {
        updateGoal,
        setGoalType,
        setSubGoalType,
        setSubGoal
    }


    return { goal, methods, setGoalType }
}

export default useGoalManager
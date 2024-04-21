import { useState } from "react"
import { BaseGoal, GoalType, Goal, PerformanceGoal, OutcomeGoal} from "@/types/Main.types";


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
            setGoal({ ...baseInfo, type: "Performance", subGoals: {} } as PerformanceGoal)
        } else if (type === "Outcome") {
            setGoal({ ...baseInfo, type: "Outcome", date: new Date(), subGoals: {} } as OutcomeGoal)
        }
    }

    return { goal, updateGoal, setGoalType }
}

export default useGoalManager
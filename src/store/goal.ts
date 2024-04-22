import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { produce } from 'immer'
import { GoalType, Goal, OutcomeGoal, AnyGoal, PerformanceGoal, SubGoal, SubGoalType } from "@/types/Main.types";


interface IGoalStore  {
    goal: Goal | null,
    subGoal: SubGoal | null,
    setGoal: (goal: Goal) => void,
    getSGoal: () => SubGoal | null,
    getGoal: () => AnyGoal | null,
    updateGoal: (updates: Goal) => void,
    setGoalType: (type: GoalType) => void,
    setSubGoalType: (subGoalType: string) => void,
    updateSubGoal: (subGoal: SubGoal) => void,
    updateOutcomeGoalDate: (date: Date) => void,
    // setSubGoal: (subGoal: SubGoal) => void,
}


const initSubGoal = {
    type: "Unset",
    value: 0
} as SubGoal
//  TODO: Persist for HMR
export const useGoalStore = create<IGoalStore>()(
    immer((set, get) => ({
        goal: null,
        subGoal: initSubGoal,

        setGoal: (goal) => {
            set(produce((draft) => draft.goal = goal ))
        },

        getGoal: () => {
            return get().goal
        },

        getSGoal: () => {
            return get().subGoal
        },

        updateGoal: (updates) => {
            set(produce((draft) => {
                if (!draft.goal) {
                    return
                }
                draft.goal = { ...draft.goal, ...updates }
            }))
        },

        setGoalType: (type) => {
            set(produce((draft) => {
                if (type === "Performance") {
                    draft.goal = { ...draft.goal, type: "Performance", sGoalSet: false, goalSet: true } as PerformanceGoal
                } else if (type === "Outcome") {
                    draft.goal = { ...draft.goal, type: "Outcome", date: new Date(), sGoalSet: false, goalSet: true } as OutcomeGoal
                }
            }))
        },

        setSubGoalType: (subGoalType) => {
            set(produce((draft) => {
                // set draft.subGoal
                if (subGoalType === "Time") {
                    draft.subGoal = { type: "Time", value: 0 }
                } else if (subGoalType === "Distance") {
                    draft.subGoal = { type: "Distance", value: 0 }
                } else if (subGoalType === "Speed") {
                    draft.subGoal = { type: "Speed", value: 0 }
                }
            }))
        },

        updateSubGoal: (subGoal) => {
            set(produce((draft) => {
                draft.subGoal = subGoal
                draft.goal = { ...draft.goal, sGoalSet: true, subGoal: subGoal }
            }))
        },

        updateOutcomeGoalDate: (date) => {
            set(produce((draft) => {
                if (draft.goal?.type === "Outcome") {
                    draft.goal = { ...draft.goal, date: date } as OutcomeGoal
                }
            }))
        }
    }))
)
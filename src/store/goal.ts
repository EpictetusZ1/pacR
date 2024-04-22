import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { produce } from 'immer'
import { GoalType, Goal, OutcomeGoal, AnyGoal, PerformanceGoal, SubGoal, SubGoalType } from "@/types/Main.types";


interface IGoalStore  {
    goal: Goal | null,
    setGoal: (goal: Goal) => void,
    getGoal: () => AnyGoal | null,
    updateGoal: (updates: Goal) => void,
    setGoalType: (type: GoalType) => void,
    setSubGoalType: (subGoalType: string) => void,
    updateSubGoal: (subGoal: SubGoal) => void,
    // setSubGoal: (subGoal: SubGoal) => void,
}


//  TODO: Persist for HMR
export const useGoalStore = create<IGoalStore>()(
    immer((set, get) => ({
        goal: null,

        setGoal: (goal) => {
            set(produce((draft) => draft.goal = goal ))
        },

        getGoal: () => {
            return get().goal
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
                if (draft.goal?.type === "Performance") {
                    draft.goal = { ...draft.goal, subGoalType: subGoalType, sGoalSet: true } as PerformanceGoal
                } else if (draft.goal?.type === "Outcome" && subGoalType !== "Speed") {
                    draft.goal = { ...draft.goal, subGoalType: subGoalType, sGoalSet: true } as OutcomeGoal
                }
            }))
        },

        updateSubGoal: (subGoal) => {
            set(produce((draft) => {
                if (!draft.goal.sGoalSet) {
                    draft.goal = { ...draft.goal, sGoalSet: true }
                }
                if (draft.goal?.type === "Performance") {
                    draft.goal = { ...draft.goal, subGoal: subGoal } as PerformanceGoal
                } else if (draft.goal?.type === "Outcome") {
                    draft.goal = { ...draft.goal, subGoal: subGoal } as OutcomeGoal
                }
            }))
        }
    }))
)
// Main Types
export interface Run {
    id: string
    startEpoch: Date
    endEpoch: Date
    activeDurationMs: bigint
    distance: number
    pace: number
    summaries: Summary[]
    tags: Tag[]
    metrics: Metric[]
    moments: Moment[]
    createdAt: string
    updatedAt: string
}

export interface Summary {
    id: string
    run_id: string
    distance: number
    duration: bigint
    pace: number
    calories: number
    steps: number
    createdAt: Date
    updatedAt: Date
}

export interface Tag {
    id: string
    run_id: string
    name: string
    createdAt: Date
    updatedAt: Date
}

export interface Metric {
    id: string
    run_id: string
    type: string
    value: number
    createdAt: string
    updatedAt: string
}

export interface Moment {
    id: string
    run_id: string
    type: string
    value: string
    createdAt: string
    updatedAt: string
}

export interface DateAndId {
    date: string,
    id: string
}

export interface SimpleRun {
    id: string
    startEpoch: string
    activeDurationMs: string
    distance: number
    pace: string
}

export type SRunAsProps = {
    id: string
    startEpoch: string
    activeDurationMs: number
    distance: number
    pace: number
}

// BEGIN: Goal Types

export interface BaseGoal {
    goalSet: boolean
    description?: string
}

export interface TimeGoal {
    time: number
}

export interface DistanceGoal {
    distance: number
}

export interface SpeedGoal {
    speed: number
}

export type GoalType = "Performance" | "Outcome"

export type SubGoal = TimeGoal | DistanceGoal | SpeedGoal

export interface OutcomeGoal extends BaseGoal {
    type: "Outcome"
    date: Date
    subGoals: SubGoal
}

export interface PerformanceGoal extends BaseGoal {
    type: "Performance"
    subGoals: SubGoal
}

export type Goal = OutcomeGoal | PerformanceGoal
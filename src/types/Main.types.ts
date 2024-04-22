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
// Define Goal Types and SubGoal Types using string literal types
export type GoalType = "Performance" | "Outcome";
export type SubGoalType = "Time" | "Distance" | "Speed" | "Unset"

// Base interface for all goals
export interface Goal {
    goalSet: boolean; // Indicates if a goal is set
    description?: string; // Optional description of the goal
    type: GoalType; // Type of the goal: Performance or Outcome
    sGoalSet: boolean; // Indicates if a sub-goal is set
    sGoalType: SubGoalType; // Type of the sub-goal: Time, Distance, or Speed
    subGoal?: SubGoal; // Optional sub-goal
}

// Define specific properties for sub-goals using a union type
// export type SubGoal =
//     | { type: "Time", time: number }
//     | { type: "Distance", distance: number }
//     | { type: "Speed", speed: number, unit: "km/h" | "mi/h" }

export interface SubGoal {
    type: SubGoalType;
    value: number;
    unit?: "km/h" | "mi/h";
}

// Extended interfaces for specific goal types
export interface OutcomeGoal extends Goal {
    date: Date; // Specific to outcome goals
}

export interface PerformanceGoal extends Goal {
    // No additional fields needed, but could add performance-specific fields here if necessary
}

// Use Goal as a union type for clarity
export type AnyGoal = OutcomeGoal | PerformanceGoal;
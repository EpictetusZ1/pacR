// Main Types
export interface Run {
    id: string
    app_id: string
    startEpoch: Date
    endEpoch: Date
    nikeLastModified: Date
    activeDurationMs: bigint
    deleteIndicator: boolean
    session: boolean
    summaries: Summary[]
    change_tokens: string[]
    sources: string[]
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


export interface SimpleRun {
    id: string
    app_id: string
    startEpoch: Date
    endEpoch: Date
    nikeLastModified: Date
    activeDurationMs: bigint
    deleteIndicator: boolean
    summaries: Summary
    session: boolean
    change_tokens: string[]
    sources: string[]
    tags: Tag[]
    createdAt: string
    updatedAt: string
}

"use client"
import { useState } from 'react';
import { GoalType } from "@/types/Main.types";


const GoalPicker = () => {
    const [goalSelected, setGoalSelected] = useState<GoalType>()
    const [showGoalTypes, setShowGoalTypes] = useState<boolean>(false)
    const goalTypes: GoalType[] = ["Process", "Performance", "Outcome"]

    return (
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

                        }}>
                        {goalType}
                    </button>
                ))
            )}
        </div>
    );
}

export default GoalPicker


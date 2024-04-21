import GoalPicker from "@/components/GoalPicker/GoalPicker";


const Goal = () => {
    return (
        <div className={"flex flex-col items-center py-12 px-4 gap-2"}>
            <h1 className={"font-bold text-2xl"}>Choose a Goal to Start</h1>
            <GoalPicker />
        </div>
    );
};

export default Goal

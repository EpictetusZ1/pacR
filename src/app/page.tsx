import Link from 'next/link'
import SignInOut from "@/components/Inputs/SignInOut/SignInOut";
import Ai from "@/components/Inputs/Ai/Ai";
import GoalPicker from "@/components/GoalPicker/GoalPicker";

export default function Home() {
    return (
        <main className="flex gap-8 min-h-screen max-h-screen flex-col items-center align-middle p-24">
            <Link href={"/userRuns/1"}
                  className="bg-darkCyan-500 hover:bg-darkCyan-400 text-white font-bold py-2 px-4 rounded">
                View All Runs
            </Link>
            <Link href={"/dashboard"}
                  className="bg-darkCyan-500 hover:bg-darkCyan-400 text-white font-bold py-2 px-4 rounded">
                View Run Graph
            </Link>
            <Link href="/src/app/uploadRuns/"
                  className="bg-darkCyan-500 hover:bg-darkCyan-400 text-white font-bold py-2 px-4 rounded">
                Upload Runs
            </Link>
            <GoalPicker/>
            {/*<Ai />*/}
            <SignInOut/>
        </main>
    );
}

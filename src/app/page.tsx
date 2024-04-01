import Link from 'next/link'

export default function Home() {
    return (
        <main className="flex gap-8 min-h-screen max-h-screen flex-col items-center align-middle p-24">
            <Link href="/UploadRuns/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Upload Runs
            </Link>
            <Link href={"/UserRuns/1"} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                User Runs
            </Link>
            <Link href={"/dashboard"} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Dashboard
            </Link>
        </main>
    );
}

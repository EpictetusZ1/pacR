import Image from "next/image";
import Link from 'next/link'

export default function Home() {
  return (
      <main className="flex min-h-screen max-h-screen flex-col items-center align-middle p-24">
        <Link href="/UploadRuns/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Upload Runs
        </Link>
        <Link href="/UserRuns/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          User Runs
        </Link>
      </main>
  );
}

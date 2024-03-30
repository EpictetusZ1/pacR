"use client"
import { useState } from "react";

const Uploader = () => {
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
    const [loading, setLoading] = useState(false)
    const handleUpload = async () => {
        if (selectedFiles) {
            setLoading(true)
            const files = Array.from(selectedFiles)
            // await Promise.all(
            //   files.map(async (file) => {
            //     const reader = new FileReader()
            //     reader.readAsText(file);
            //     reader.onload = async () => {
            //       const data = JSON.parse(reader.result as string)
            //       await prisma.run.create({
            //         data: {
            //         },
            //       })
            //     }
            //   })
            // )
            setLoading(false)
        }
    }
    return (
        <div className="shadow-md rounded-md p-4 gap-x-4 gap-y-5">
            <div className="flex flex-col p-4 gap-x-4 gap-y-5 items-center justify-center ">
                <input type="file"
                       multiple
                       onChange={(e) => setSelectedFiles(e.target.files)}
                       className={"bg-green-600 hover:bg-green-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded"}
                />
                <button onClick={handleUpload}
                        className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}
                >
                    Upload
                </button>
                {loading && <p>Uploading...</p>}
            </div>
        </div>
    )
}

export default Uploader

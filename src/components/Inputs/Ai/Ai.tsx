"use client"
import { useState } from "react";


const Ai = () => {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Function to fetch data from the API
    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch("/api/ai",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },

                })
            const data = await response.json()
            console.log(data)
            if (!response.ok) {
                throw new Error("Network response was not ok")
            }
            setData(data)
        } catch (error) {
            // @ts-ignore
            setError(`Failed to fetch data: ${error.message}`)
        } finally {
            setLoading(false)
        }
    };

    return (
        <div>
            <button onClick={fetchData}>Fetch Data</button>
            {loading && <p>Loading...</p>}
        </div>
    );
}

export default Ai

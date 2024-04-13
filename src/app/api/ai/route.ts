// gpt-3.5-turbo-0125
import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
})


// const chatCompletion = await openai.chat.completions.create({
//     messages: [{ role: "user", content: "Say this is a test" }],
//     model: "gpt-3.5-turbo-0125"
// })
//
//
// export function GET(
//     req: NextApiRequest,
// ) {
//     console.log("chatCompletion", chatCompletion)
//     // choices
//     console.log("chatCompletion.choices", chatCompletion.choices[0])
//     return Response.json({ message: chatCompletion})
// }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { runsData, goalType } = req.body;

        // Here you might summarize the runs data
        const summary = `The user's average pace over the last two months is ${runsData.averagePace} minutes per kilometer, and their average distance is ${runsData.averageDistance} kilometers. Goal type: ${goalType}.`

        try {
            const chatCompletion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a virtual coach giving advice on running based on data analysis." },
                    { role: "user", content: summary }
                ]
            })

            res.status(200).json({ advice: chatCompletion.choices[0].message.content })
        } catch (error) {
            console.error("OpenAI API error:", error)
            res.status(500).json({ error: "Failed to fetch advice from OpenAI API." })
        }
    } else {
        res.setHeader("Allow", ["POST"])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}

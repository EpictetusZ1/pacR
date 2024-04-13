// gpt-3.5-turbo-0125
import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";

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

export async function GET(req: Request) {
    if (req.method === "POST") {
        // const { runsData, goalType } = req.body

        // Here you might summarize the runs data
        // const summary = `The user's average pace over the last two months is ${runsData.averagePace} minutes per kilometer, and their average distance is ${runsData.averageDistance} kilometers. Goal type: ${goalType}.`

        const summary = ""

        try {
            const chatCompletion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a virtual coach giving advice on running based on data analysis." },
                    { role: "user", content: summary }
                ]
            })

            // res.status(200).json({ advice: chatCompletion.choices[0].message.content })
            return Response.json({ advice: chatCompletion.choices[0].message.content })

        } catch (error) {
            console.error("OpenAI API error:", error)
            return Response.json({ error: "Failed to fetch data" })
        }
    } else {
        return Response.json({ error: "Invalid request method" })
    }
}

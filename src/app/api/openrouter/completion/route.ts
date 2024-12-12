import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export const maxDuration = 30;
// export const runtime = "edge";

const baseUrl = process.env["OPENROUTER_API_URL"];
const apiKey = process.env["OPENROUTER_API_KEY_WRITER"];

export async function POST(req: Request): Promise<Response> {
    const {prompt, modelName, system, temperature} = await req.json();
    const temperatureFloat = parseFloat(temperature);

    if ( prompt === undefined
        || modelName  === undefined
        || system  === undefined
        || temperatureFloat === undefined
    ) {
        return new Response("Missing required parameters", { status: 400 });
    }

    const openaiClient = createOpenAI({ 
        apiKey: apiKey, 
        baseUrl: baseUrl,
    }); 

    const result = streamText({
        model: openaiClient(modelName),
        system:system,
        prompt: prompt,
        temperature: temperatureFloat,
    });

    return (await result).toDataStreamResponse();
}
import { streamText } from "ai";
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

export const maxDuration = 30;
// export const runtime = "edge";

const apiKey = process.env["OPENROUTER_API_KEY_WRITER"];

// ref : https://openrouter.ai/docs/frameworks
async function getOpenRouterClient() {
    const openRouterClient = createOpenRouter({
        apiKey: apiKey,
    });
    return openRouterClient;
}

export async function POST(req: Request): Promise<Response> {
    const {prompt, modelName, system, temperature} = await req.json();

    if ( prompt === undefined
        || modelName  === undefined
        || system  === undefined
        || temperature === undefined
    ) {
        return new Response("Missing required parameters", { status: 400 });
    }

    const aiClient = await getOpenRouterClient();
    const temperatureFloat = parseFloat(temperature);

    const result = await streamText({
        model: aiClient(modelName),
        system:system,
        prompt: prompt,
        temperature: temperatureFloat,
    });

    return result.toDataStreamResponse();
}
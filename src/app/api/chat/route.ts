import { google } from '@ai-sdk/google';
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req:Request) {
    const { messages } = await req.json();
    const model = google("gemini-1.5-flash-latest");
    const result = await streamText({
        model:model,
        messages,
    });

    return result.toDataStreamResponse();
}

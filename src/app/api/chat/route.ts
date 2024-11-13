import { createOllama } from "ollama-ai-provider";
// import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req:Request) {
    const { messages } = await req.json();

    const ollamaClient = createOllama();
    const ollamaModel = ollamaClient("phi3");

    const model = ollamaModel;

    const result = await streamText({
        model:model,
        messages
    });

    return result.toDataStreamResponse();
}

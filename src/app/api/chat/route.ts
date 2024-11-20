import { createOllama } from "ollama-ai-provider";
import { openai } from "@ai-sdk/openai";
import { google } from '@ai-sdk/google';
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req:Request) {
    const { messages } = await req.json();

    const modelProvider: string = "ollama";

    let model = null;

    switch(modelProvider) {
        case "openai": 
            model = openai('gpt-4o');
            console.log("model: openai");
            break;
        case "google": 
            model = google("gemini-1.5-flash-latest");
            console.log("model: google");
            break;
        case "ollama":
            const ollamaClient = createOllama();
            model = ollamaClient("qwen2.5:1.5b");
            console.log("model: ollama");
            break;
        default: 
            break;
    }

    if (model === null) {
        return "Invalid LLM Provider";
    }

    const result = await streamText({
        model:model,
        messages,
    });

    return result.toDataStreamResponse();
}

"use server"

import { prisma } from "@/_lib/db/client";
import { streamText } from "ai";
import { createStreamableValue  } from "ai/rsc";
import { google } from '@ai-sdk/google';
import { createOllama } from "ollama-ai-provider";

async function genSHA256Hash(input:string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(await hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

const llmApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?? "";
const hashedApiKey = await genSHA256Hash(llmApiKey);

export async function generate(system: string, userMessage:string) {
    const stream = createStreamableValue("");

    let model = google("gemini-1.5-flash-latest");

    if (process.env.NODE_ENV === "development") {
        const ollamaClient = createOllama();
        model = ollamaClient("qwen2.5:1.5b");
    } else if (process.env.NODE_ENV === "production") {
        const apiCountQyeryData = await prisma.apiCount.findUnique({where:{hashAPIKey:hashedApiKey}});
        if (apiCountQyeryData?.id === undefined) {
            try {
                await prisma.apiCount.create({data:{hashAPIKey:hashedApiKey}});
            } catch (error) {
                stream.done();
                return { message: "Create api count failed: " + error };
            }
        } else {
            try {
                const apiCount = apiCountQyeryData.usageCount + 1;
                if (apiCount > 100) {
                    stream.done();
                    return { message: "API limit exceeded" };
                }
                await prisma.apiCount.update({
                    where:{hashAPIKey:hashedApiKey},
                    data:{usageCount:apiCount}
                });
            } catch (error) {
                stream.done();
                return { message: "Update api count failed: " + error };
            }
        }
    } else {
        stream.done();
        return { message: "NODE_ENV not set"};
    }

    (async () => {
        const { textStream } = await streamText({
            model:model,
            system:system,
            prompt: userMessage,
        });

        for await (const chunk of textStream) {
            stream.append(chunk);
        }
        stream.done();
    })();

    return {output: stream.value};
}
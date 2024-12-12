
export const maxDuration = 30;

const baseUrl = process.env["OPENROUTER_API_URL"];

export async function GET(): Promise<Response> {

    const response = await fetch(`${baseUrl}/models`);
    if (response.status === 200) {
        const data = await response.json();
        for (const model of data["data"]) {
            console.log("model name: "+model["name"]);
        }
    }

    return new Response("OK", {status:200});
}
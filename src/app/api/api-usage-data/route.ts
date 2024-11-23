import { prisma } from "@/_lib/db/client";

async function genSHA256Hash(input: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(await hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

const llmApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? "";
const hashedApiKey = await genSHA256Hash(llmApiKey);

async function fetchApiUsageCount() {
  const apiCountQyeryData = await prisma.apiCount.findUnique({ where: { hashAPIKey: hashedApiKey } });
  return apiCountQyeryData?.usageCount ?? -1;
}
export async function GET() {
  const apiUsageCount = await fetchApiUsageCount();
  const json = JSON.stringify({ "apiUsageCount": apiUsageCount });
  return new Response(json);
}
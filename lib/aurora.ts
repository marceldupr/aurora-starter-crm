import { AuroraClient } from "@aurora-studio/sdk";

const baseUrl =
  process.env.AURORA_API_URL ??
  process.env.NEXT_PUBLIC_AURORA_API_URL ??
  "";
const apiKey =
  process.env.AURORA_API_KEY ??
  process.env.NEXT_PUBLIC_AURORA_API_KEY ??
  "";

const specUrl = baseUrl ? `${baseUrl.replace(/\/$/, "")}/v1/openapi.json` : undefined;

export function createAuroraClient(): AuroraClient {
  if (!baseUrl || baseUrl.startsWith("/")) {
    throw new Error(
      "Aurora API URL is not configured. Set AURORA_API_URL (or NEXT_PUBLIC_AURORA_API_URL)."
    );
  }
  return new AuroraClient({ baseUrl, apiKey, specUrl });
}

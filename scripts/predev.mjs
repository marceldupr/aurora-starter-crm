#!/usr/bin/env node
/**
 * Runs provision + seed before dev server starts.
 * Skips if AURORA_API_URL/AURORA_API_KEY are not set.
 */
import { spawnSync } from "child_process";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptsDir = join(__dirname);

const apiUrl = process.env.AURORA_API_URL || process.env.NEXT_PUBLIC_AURORA_API_URL;
const apiKey = process.env.AURORA_API_KEY;

if (!apiUrl || !apiKey) {
  console.log("[predev] Skipping provision/seed — set AURORA_API_URL and AURORA_API_KEY to enable.");
  process.exit(0);
}

function run(script, label) {
  const res = spawnSync("node", [script], {
    cwd: join(__dirname, ".."),
    stdio: "inherit",
    env: process.env,
  });
  if (res.status !== 0) {
    console.warn(`[predev] ${label} failed (exit ${res.status}) — continuing anyway.`);
  }
}

run(join(scriptsDir, "provision-schema.mjs"), "Provision");
if (existsSync(join(scriptsDir, "seed.mjs")) && !process.env.VERCEL && process.env.NODE_ENV !== "production") {
  run(join(scriptsDir, "seed.mjs"), "Seed");
}
process.exit(0);

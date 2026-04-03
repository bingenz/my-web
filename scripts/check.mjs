import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const indexPath = path.join(distDir, "index.html");

function parseAssetRefs(html) {
  const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((ref) => !/^(?:[a-z]+:|#)/i.test(ref));

  return [...new Set(refs)];
}

async function assertExists(filePath) {
  await fs.access(filePath);
}

async function maybeRunWranglerCheck() {
  const majorVersion = Number.parseInt(process.versions.node.split(".")[0], 10);
  if (majorVersion < 20) {
    throw new Error(
      `Wrangler validation requires Node.js 20 or newer. Current version: ${process.versions.node}`
    );
  }

  try {
    const { stdout, stderr } = await execFileAsync(
      process.platform === "win32" ? "npx.cmd" : "npx",
      ["wrangler", "check"],
      { cwd: rootDir }
    );

    if (stdout.trim()) console.log(stdout.trim());
    if (stderr.trim()) console.log(stderr.trim());
  } catch (error) {
    const output = [error.stdout, error.stderr].filter(Boolean).join("\n").trim();
    if (output) console.error(output);
    throw error;
  }
}

async function main() {
  await assertExists(indexPath);
  const html = await fs.readFile(indexPath, "utf8");
  const refs = parseAssetRefs(html);
  const missing = [];

  for (const ref of refs) {
    const normalized = ref.replace(/^\.\//, "");
    const absolutePath = path.join(distDir, normalized);

    try {
      await assertExists(absolutePath);
    } catch {
      missing.push(ref);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing built assets: ${missing.join(", ")}`);
  }

  await maybeRunWranglerCheck();
  console.log("Static checks passed");
}

await main();

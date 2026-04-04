import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const sourceDir = path.join(rootDir, "public");
const outputDir = path.join(rootDir, "dist");

async function resetDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const targetPath = path.join(dirPath, entry.name);
    await fs.rm(targetPath, { recursive: true, force: true });
  }
}

async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  const entries = await fs.readdir(from, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(from, entry.name);
    const targetPath = path.join(to, entry.name);

    if (entry.isDirectory()) {
      await copyDir(sourcePath, targetPath);
      continue;
    }

    await fs.copyFile(sourcePath, targetPath);
  }
}

async function main() {
  await resetDir(outputDir);
  await copyDir(sourceDir, outputDir);
  console.log("Built static site into dist/");
}

await main();

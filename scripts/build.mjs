import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const sourceDir = path.join(rootDir, "public");
const outputDir = path.join(rootDir, "dist");
const hashedExts = new Set([".css", ".js"]);
const assetMap = new Map();

async function resetDir(dirPath) {
  await fs.rm(dirPath, { recursive: true, force: true });
  await fs.mkdir(dirPath, { recursive: true });
}

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function hashContent(content) {
  return crypto.createHash("sha256").update(content).digest("hex").slice(0, 10);
}

async function copyDir(from, to, baseDir = from) {
  await fs.mkdir(to, { recursive: true });
  const entries = await fs.readdir(from, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(from, entry.name);
    const targetPath = path.join(to, entry.name);

    if (entry.isDirectory()) {
      await copyDir(sourcePath, targetPath, baseDir);
      continue;
    }

    const relativePath = path.relative(baseDir, sourcePath);
    const extension = path.extname(entry.name).toLowerCase();

    if (hashedExts.has(extension)) {
      const content = await fs.readFile(sourcePath);
      const hash = hashContent(content);
      const parsed = path.parse(targetPath);
      const hashedName = `${parsed.name}.${hash}${parsed.ext}`;
      const hashedTargetPath = path.join(parsed.dir, hashedName);

      await fs.copyFile(sourcePath, hashedTargetPath);

      assetMap.set(
        toPosix(relativePath),
        toPosix(path.relative(outputDir, hashedTargetPath))
      );
      continue;
    }

    await fs.copyFile(sourcePath, targetPath);
  }
}

async function rewriteHtmlReferences(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await rewriteHtmlReferences(fullPath);
      continue;
    }

    if (path.extname(entry.name).toLowerCase() !== ".html") {
      continue;
    }

    let html = await fs.readFile(fullPath, "utf8");

    for (const [originalRef, hashedRef] of assetMap.entries()) {
      const escaped = originalRef.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      html = html.replace(new RegExp(`(["'])${escaped}(["'])`, "g"), `$1${hashedRef}$2`);
      html = html.replace(new RegExp(`(["'])/${escaped}(["'])`, "g"), `$1/${hashedRef}$2`);
    }

    await fs.writeFile(fullPath, html, "utf8");
  }
}

async function main() {
  await resetDir(outputDir);
  await copyDir(sourceDir, outputDir);
  await rewriteHtmlReferences(outputDir);
  console.log("Built static site into dist/ with fingerprinted CSS/JS assets.");
}

await main();

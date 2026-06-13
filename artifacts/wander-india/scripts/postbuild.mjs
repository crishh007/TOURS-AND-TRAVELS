import { copyFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publishDir = path.resolve(root, "dist/public");
const indexHtml = path.join(publishDir, "index.html");
const fallbackHtml = path.join(publishDir, "404.html");

copyFileSync(indexHtml, fallbackHtml);

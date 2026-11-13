// Renders the EJS app shell (static/index.html) into plain HTML so the build
// can be served by a static host such as Vercel, where no Express server runs
// RenderHtml.ts at request time. Uses the environment-only render
// (perServer: false), the same one uploaded per version for the static Worker.
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

process.env.GAME_ENV ||= "prod";
// Cloudflare's public always-pass test key; set TURNSTILE_SITE_KEY for real use.
process.env.TURNSTILE_SITE_KEY ||= "1x00000000000000000000AA";
process.env.DOMAIN ||= process.env.VERCEL_PROJECT_PRODUCTION_URL || "localhost";
process.env.GIT_COMMIT ||= process.env.VERCEL_GIT_COMMIT_SHA || "unknown";

const { renderHtmlContent } = await import("../src/server/RenderHtml");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(__dirname, "../static/index.html");

const html = await renderHtmlContent(indexPath, { perServer: false });
if (html.includes("<%")) {
  throw new Error("Rendered index.html still contains EJS tags");
}
await fs.writeFile(indexPath, html);
console.log(`Rendered static app shell: ${indexPath}`);

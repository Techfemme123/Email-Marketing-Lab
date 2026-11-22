// Usage: node scripts/review.mjs <campaign-folder>
// Runs Claude Code headless to review a campaign's emails and saves review/findings.json.
// Exit code: 0 = no high-severity findings, 1 = at least one high, 2 = script/run error.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const folder = process.argv[2];
if (!folder) {
  console.error("Usage: node scripts/review.mjs <campaign-folder>");
  process.exit(2);
}

// Minify the schema so it is one line of text.
const schema = JSON.stringify(
  JSON.parse(readFileSync(resolve(root, "review/findings.schema.json"), "utf8"))
);
let prompt = `Review every email in ${folder} against brand/voice.md and .claude/rules/emails.md. Report only real problems.`;

// If the last saved review was for this same folder, show Claude its findings
// so it only reports what is new or still not fixed.
const outFile = resolve(root, "review/findings.json");
const same = (a, b) => resolve(root, a).toLowerCase() === resolve(root, b).toLowerCase();
if (existsSync(outFile)) {
  try {
    const prev = JSON.parse(readFileSync(outFile, "utf8"));
    if (typeof prev.folder === "string" && same(prev.folder, folder) && Array.isArray(prev.findings)) {
      prompt +=
        `

Earlier findings for this folder:
${JSON.stringify(prev.findings, null, 2)}

` +
        "These are findings from the last review. Report only problems that are new or still not fixed. Don't repeat ones that have been fixed.";
      console.log(`Using ${prev.findings.length} earlier findings for ${folder}.`);
    }
  } catch {
    // unreadable file: treat as a fresh review
  }
}
const args = [
  "-p", prompt,
  "--output-format", "json",
  "--json-schema", schema,
  "--allowedTools", "Read,Glob,Grep",
];

// Find claude: a real .exe/.cmd on PATH (Windows) or plain "claude".
function findClaude() {
  if (process.platform !== "win32") return "claude";
  const r = spawnSync("where", ["claude"], { encoding: "utf8" });
  const hits = (r.stdout || "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  return (
    hits.find((p) => /\.exe$/i.test(p)) ||
    hits.find((p) => /\.cmd$/i.test(p)) ||
    hits[0] ||
    "claude"
  );
}

const exe = findClaude();
const needsShell = /\.(cmd|bat)$/i.test(exe);
let res;
if (needsShell) {
  // .cmd files must go through cmd.exe: quote every arg, escaping inner double quotes.
  const q = (s) => `"${String(s).replace(/"/g, '\\"')}"`;
  res = spawnSync(`"${exe}" ${args.map(q).join(" ")}`, {
    cwd: root, shell: true, encoding: "utf8", maxBuffer: 64 * 1024 * 1024,
  });
} else {
  // No shell: arguments go straight to the program, so quotes in the schema are safe.
  res = spawnSync(exe, args, {
    cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024,
  });
}
if (res.error || res.status !== 0) {
  console.error("claude failed:", res.error?.message || `exit ${res.status}`);
  if (res.stderr) console.error(res.stderr);
  if (res.stdout) console.error(res.stdout.slice(0, 2000));
  process.exit(2);
}

// Output may be one object or a list whose last item is the result.
let out;
try {
  out = JSON.parse(res.stdout);
} catch {
  console.error("Could not parse claude output as JSON:\n" + res.stdout.slice(0, 2000));
  process.exit(2);
}
const result = Array.isArray(out) ? out[out.length - 1] : out;
const data = result?.structured_output;
if (!data || !Array.isArray(data.findings)) {
  console.error("No structured_output in result:\n" + JSON.stringify(result, null, 2).slice(0, 2000));
  process.exit(2);
}

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify({ folder, findings: data.findings }, null, 2) + "\n");

const count = { high: 0, medium: 0, low: 0 };
for (const f of data.findings) count[f.severity] = (count[f.severity] || 0) + 1;
console.log(
  `${folder}: ${data.findings.length} findings (${count.high} high, ${count.medium} medium, ${count.low} low) -> review/findings.json`
);
process.exit(count.high > 0 ? 1 : 0);

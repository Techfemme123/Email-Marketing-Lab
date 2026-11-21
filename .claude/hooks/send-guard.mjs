// PreToolUse guard for Resend MCP tools. Exit 2 blocks the call.
let raw = "";
for await (const chunk of process.stdin) raw += chunk;

let input;
try {
  input = JSON.parse(raw);
} catch {
  console.error("send-guard: could not read the tool call, so it was blocked.");
  process.exit(2);
}

const name = String(input.tool_name || "").replace(/^mcp__resend__/, "");
const args = input.tool_input || {};
const myEmail = (process.env.MY_EMAIL || "").trim().toLowerCase();

const alwaysBlock = ["send-broadcast", "create-automation", "send-inbox-draft", "send-new-inbox-email"];
const checked = ["send-email", "send-batch-emails"];

function block(reason) {
  console.error(`Blocked by send-guard: ${reason}`);
  process.exit(2);
}

// Pull "a@b.com" out of "Name <a@b.com>" forms.
function clean(addr) {
  const s = String(addr).trim();
  const m = s.match(/<([^>]+)>/);
  return (m ? m[1] : s).trim().toLowerCase();
}

function addressesOf(obj) {
  const out = [];
  for (const key of ["to", "cc", "bcc"]) {
    const v = obj?.[key];
    if (v == null) continue;
    for (const a of Array.isArray(v) ? v : [v]) out.push(clean(a));
  }
  return out;
}

function isAllowed(addr) {
  return addr.endsWith("@resend.dev") || (myEmail !== "" && addr === myEmail);
}

if (alwaysBlock.includes(name)) {
  block(`${name} can reach whole lists of people, so it is never allowed.`);
}

if (checked.includes(name)) {
  let addrs;
  if (name === "send-batch-emails") {
    const list = Array.isArray(args.emails) ? args.emails
      : Array.isArray(args) ? args : null;
    if (!list) block("could not find the emails in this batch.");
    addrs = list.flatMap(addressesOf);
  } else {
    addrs = addressesOf(args);
  }
  if (addrs.length === 0) block("no recipient addresses found.");
  for (const a of addrs) {
    if (!isAllowed(a)) {
      block(`${a} is not allowed. Only @resend.dev addresses and MY_EMAIL can receive email.`);
    }
  }
}

process.exit(0);

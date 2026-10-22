import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const root = fileURLToPath(new URL("../", import.meta.url));
const workspace = mkdtempSync(path.join(tmpdir(), "swc-dom-source-next-"));
const app = path.join(workspace, "app");
const env = { ...process.env, NEXT_TELEMETRY_DISABLED: "1" };
delete env.NODE_ENV;
cpSync(path.join(root, "tests/nextjs"), app, { recursive: true });
console.log(`Integration app and logs: ${workspace}`);

function run(command, args, cwd, extraEnv = {}) {
  const result = spawnSync(command, args, {
    cwd, env: { ...env, ...extraEnv }, encoding: "utf8", timeout: 300_000,
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, `${command} ${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

const [packed] = JSON.parse(run("npm", ["pack", "--json", "--pack-destination", workspace], root));
assert(packed.files.some((file) => file.path === "swc_dom_source.wasm"), "Build Wasm with npm run build first");
run("npm", ["install", "--no-audit", "--no-fund", path.join(workspace, packed.filename)], app);
const installed = JSON.parse(readFileSync(path.join(app, "node_modules/@vybe-adk/swc-dom-source/package.json")));
assert.equal(installed.version, "0.2.0");
const next = path.join(app, "node_modules/next/dist/bin/next");

function checkHtml(html, attr) {
  const tag = (id) => {
    const match = html.match(new RegExp(`<[^>]+\\bid="${id}"[^>]*>`));
    assert(match, `Missing #${id}`);
    return match[0];
  };
  for (const id of ["host", "nested", "forwarded"]) {
    assert.match(tag(id), new RegExp(`${attr}="[^"]*app/page\\.jsx:\\d+:\\d+"`));
  }
  assert.match(tag("client"), new RegExp(`${attr}="[^"]*components/client\\.jsx:\\d+:\\d+"`));
  assert.match(tag("existing"), new RegExp(`${attr}="manual"`));
  assert.equal((tag("existing").match(new RegExp(`${attr}=`, "g")) || []).length, 1);
  assert(!tag("excluded").includes(`${attr}=`), "Excluded file was transformed");
  if (attr !== "data-source") assert(!tag("host").includes("data-source="));
}

async function checkServer(command, attr) {
  const args = command === "dev" ? ["dev", "--turbopack"] : ["start"];
  const child = spawn(process.execPath, [next, ...args, "--hostname", "127.0.0.1", "--port", "0"], {
    cwd: app, env: { ...env, SOURCE_ATTR: attr }, stdio: ["ignore", "pipe", "pipe"],
  });
  const closed = once(child, "close");
  let log = "";
  child.stdout.on("data", (data) => { log += data; });
  child.stderr.on("data", (data) => { log += data; });
  try {
    const deadline = Date.now() + 120_000;
    let url;
    while (Date.now() < deadline) {
      assert.equal(child.exitCode, null, log);
      url = log.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
      if (url && /Ready in/.test(log)) break;
      await delay(100);
    }
    assert(url && /Ready in/.test(log), `Server did not become ready:\n${log}`);
    // Exercise the actual HTTP response, including server and client components.
    const html = run("curl", ["--fail", "--silent", "--show-error", "--max-time", "120", url], app);
    writeFileSync(path.join(workspace, `${command}-${attr}.html`), html);
    checkHtml(html, attr);
  } finally {
    child.kill("SIGTERM");
    const force = setTimeout(() => child.kill("SIGKILL"), 5_000);
    await closed;
    clearTimeout(force);
    writeFileSync(path.join(workspace, `${command}-${attr}.log`), log);
  }
  assert(!/Failed to execute|failed to deserialize|Mismatch \{|panicked at|Error:/i.test(log), log);
  console.log(`${command} (${attr}): HTML and plugin log checks passed`);
}

await checkServer("dev", "data-source");
await checkServer("dev", "data-origin");
const build = run(process.execPath, [next, "build", "--turbopack"], app, { SOURCE_ATTR: "data-source" });
writeFileSync(path.join(workspace, "build.log"), build);
console.log(build);
await checkServer("start", "data-source");

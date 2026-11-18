#!/usr/bin/env node

import { execFileSync } from "node:child_process";

const root = process.argv[2] || process.cwd();

function fail(message) {
  console.error(message);
  process.exit(1);
}

let origin;
try {
  origin = execFileSync("git", ["remote", "get-url", "origin"], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
} catch {
  fail("当前目录没有 git origin，无法确定目标项目。");
}

function parse(remoteUrl) {
  const patterns = [
    /^git@([^:]+):(.+?)(?:\.git)?$/,
    /^ssh:\/\/(?:git@)?([^/]+)\/(.+?)(?:\.git)?$/,
    /^https?:\/\/([^/]+)\/(.+?)(?:\.git)?\/?$/,
  ];

  for (const pattern of patterns) {
    const match = remoteUrl.match(pattern);
    if (!match) {
      continue;
    }
    return {
      host: match[1],
      projectPath: match[2].replace(/\.git$/, ""),
    };
  }

  return null;
}

const parsed = parse(origin);
if (!parsed || !parsed.projectPath) {
  fail(`无法解析 origin：${origin}`);
}

if (!parsed.host.toLowerCase().includes("gitlab")) {
  fail(`origin 不是 GitLab，已停止：${origin}`);
}

console.log(
  JSON.stringify(
    {
      host: parsed.host,
      projectPath: parsed.projectPath,
      repo: `https://${parsed.host}/${parsed.projectPath}`,
      origin,
    },
    null,
    2,
  ),
);

#!/usr/bin/env node

import { execFileSync } from "node:child_process";

const root = process.argv[2] || process.cwd();

function fail(message) {
  console.error(message);
  process.exit(1);
}

function redact(remoteUrl) {
  return remoteUrl
    .replace(/^(https?:\/\/)[^/@]+@/i, "$1")
    .replace(/^(ssh:\/\/)[^/@]+@/i, "$1");
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

const visibleOrigin = redact(origin);

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
      host: match[1].replace(/:\d+$/, ""),
      projectPath: match[2].replace(/\.git$/, ""),
    };
  }

  return null;
}

function isGitHubHost(host) {
  const labels = host.toLowerCase().split(".").filter(Boolean);
  return labels.includes("github");
}

const parsed = parse(visibleOrigin);
if (!parsed || !parsed.projectPath) {
  fail(`无法解析 origin：${visibleOrigin}`);
}

if (!isGitHubHost(parsed.host)) {
  fail(`origin 不是 GitHub，已停止：${visibleOrigin}`);
}

const parts = parsed.projectPath.split("/").filter(Boolean);
if (parts.length !== 2) {
  fail(`解析不出 owner/repo，已停止：${visibleOrigin}`);
}

const [owner, repoName] = parts;
const repo = `${parsed.host}/${owner}/${repoName}`;

console.log(
  JSON.stringify(
    {
      host: parsed.host,
      owner,
      repoName,
      repo,
      origin: visibleOrigin,
    },
    null,
    2,
  ),
);

# skills

本仓库是 `matt-dev-workflow` 与 `matt-direct-dev-workflow` 两个 skill 的**版本化源**：

- 源文件：`skills/matt-dev-workflow/SKILL.md`、`skills/matt-direct-dev-workflow/SKILL.md`
- 两者是同一套流程的 TDD / 非 TDD 变体；正式约束由调用方仓库的 `AGENTS.md` 与 `docs/**` 提供，本仓库只维护流程本身

## 运行时副本（不是软链）

Agent 实际读取的是 `~/.agents/skills/<name>/SKILL.md`。它是**独立副本**，与本仓库**不是软链关系**：改任何一边都不会自动同步到另一边。

`~/.codex/skills` 已于 2026-10-25 改为指向 `~/.agents/skills` 的**软链**，所以运行时只有一份内容可改、可 diff；不要再往 `~/.codex/skills` 里单独复制。该软链是手工建立的，Codex 应用若在升级时把它换回真实目录，两处会重新漂移——用下面第 4 步的 `diff` 能立刻发现（也可以先 `ls -la ~/.codex | grep skills` 看它还是不是 `-> /Users/<你>/.agents/skills`）。换回真实目录前的原始内容备份在 `~/.codex/skills.bak-20261025`。

- 仓库里改了、没复制到运行时 → **不生效**（agent 读到的还是旧内容）。
- 运行时里改了、没回流到仓库 → 不进版本控制：**换机器或重装即丢**，也不会出现在任何 diff / 审查里。

## 改动流程

1. 在**本仓库**改 `skills/<name>/SKILL.md`（这是唯一的事实源，改动走正常 git 流程）。
2. 复制到运行时。命令在**本仓库根**执行，`<name>` 替换为实际 skill 名（如 `matt-dev-workflow`）：

   ```sh
   mkdir -p ~/.agents/skills/<name> && cp -R skills/<name>/. ~/.agents/skills/<name>/
   ```

   先 `mkdir -p` 是因为「重装即丢」之后运行时目录可能已不存在，直接 `cp` 到不存在的目录会失败；用 `cp -R skills/<name>/.` 整目录复制（而不是只复制 `SKILL.md`），是为了将来 skill 带上 `scripts/` / `references/` 时不至于静默漏掉。
3. 反向回流：如果是在运行时副本上先改的（比如临时试验），必须把改动复制回本仓库 `skills/<name>/SKILL.md`，再走正常 git 流程；否则那份改动不进版本控制，换机器或重装即丢。
4. 两边 `diff` 确认一致，例如（`~/.codex/skills` 是软链时，它和第一行检查的是同一份文件）：

   ```sh
   diff -q skills/matt-dev-workflow/SKILL.md ~/.agents/skills/matt-dev-workflow/SKILL.md
   diff -q skills/matt-direct-dev-workflow/SKILL.md ~/.agents/skills/matt-direct-dev-workflow/SKILL.md
   ```

   `diff` 无输出即一致；有输出说明两边又漂移了，先对齐再继续。

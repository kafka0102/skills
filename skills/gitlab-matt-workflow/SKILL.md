---
name: gitlab-matt-workflow
description: 把目标项目的一条 GitLab Issue 当作需求锚点，先落锚并 grill，用户说 go 后再从 spec 起跑 matt-dev-workflow。只改 Issue，或不绑定 GitLab Issue 的本地开发，不用本技能。
---

# GitLab Matt Workflow

把 `gitlab-issues` 和 `matt-dev-workflow` 接成一条流程。先读这两个技能。本文件只写衔接处的覆盖，其余步骤以那两个技能为准。使用 `matt-dev-workflow`，不改这两个技能的源文件。

**需求锚点**是目标项目里的一条 GitLab Issue。`matt-dev-workflow` 里的「共识锚点」是 spec 的起点，不是这条 Issue。

## 落锚

在当前工作目录按 `gitlab-issues` 确定目标项目，并落成一条需求锚点。

- 用户给的 Issue URL 所在项目与解析出的目标项目不一致时，停止并说明两边的项目。只操作目标项目。
- 编号、新建、搜索同一事项，都按 `gitlab-issues` 的判断动作。一次运行只落一条。
- 标题只在创建时写成一句问题或期望能力。用户这次没有明确要求改标题时，保持原标题。
- 正文按 `gitlab-issues` 的整理说法写入。

完成标准：有一条属于目标项目的 Issue，回复里有它的 URL；正文里只有已经说清的节。`gitlab-issues` 要求停止时，本流程也停止。

## 厘清

对着这条需求锚点做 grill。提问格式用 `matt-dev-workflow` 阶段 0：一次一题，编号多选题。术语和 ADR 写在目标项目，不写进技能仓库。

问的是还没说清、并且会改变正文或实现范围的决定。代码和文档里能查到的事实自己查。低风险的呈现选择采用推荐项，留到 spec 的「共识与默认决策」。

某一节被说清后，立刻按 `gitlab-issues` 更新正文。只准备评论时不改正文。

完成标准：用户说 `go`、`开始`、`继续` 或 `别问了` 之前，不进入 spec。正文与当时已经说清的节一致。

## go 之后

`go`、`开始`、`继续`、`别问了` 都进入自动阶段。还没答的题按推荐项写成假设。此后按 `matt-dev-workflow` 的无人阶段执行，跳过它的阶段 0。

先把做法和 go 当时的需求锚点正文对照。对不上时，停在这里并说明矛盾，回到同一条需求锚点继续 grill。这时不写 spec，不改 Issue，不提交，也不实现其余部分。

对得上时，做 `matt-dev-workflow`「切入无人阶段」的两件准备，再从它的阶段 1 跑到最终验收。准备里的共识清单写入 spec。spec 记下需求锚点的 URL，并原文记下 go 当时的正文。spec 可以更细；每一条验收都要能指出它没有和这份正文冲突。

本地票仍按目标仓库的 issue tracker 落在本地。提交按 `matt-dev-workflow` 和目标仓库自己的 git 规范。commit message 按目标仓库的规范写，不由本流程追加 `Refs`。go 之后保持需求锚点的标题、正文、评论和开关状态不变，不论自动阶段走完，还是因为矛盾或 `matt-dev-workflow` 的停止条件停下。

实现途中才发现与 go 当时的正文冲突时，停下整个自动阶段，不再写后续 spec 或票，也不再提交。已经存在的 commit 保留，在汇总里说明，历史保持原样。

完成标准：要么 spec、本地票和实现都按 `matt-dev-workflow` 的完成判定走完，且 go 之后回读的 Issue 与 go 当时一致；要么停在矛盾或 `matt-dev-workflow` 的停止条件处，没有新的违规提交。汇总里写出 Issue URL。验收之后可以建议用户跑 `/retro`，由用户自己跑。

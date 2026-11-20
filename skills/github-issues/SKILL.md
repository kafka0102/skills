---
name: github-issues
description: 管理当前仓库的 GitHub Issue。给出编号或 URL 时只改这一条；出现「远程 Issue 已创建，更新这一条，不要新建。」时更新该描述。只用 gh。也可在明确说新建时创建、搜索后更新、评论，或只起草不写入。目标项目取当前目录的 git origin。不实现需求，也不提交代码。
---

# GitHub Issue

使用本机已登录的 `gh` 修改目标项目中的 GitHub Issue。参数以当前 `gh issue <command> --help` 为准。不保存 token，不打印凭据。登录检查用 `gh auth status --hostname <host>`，不带 `--show-token`。输出里若有 token，不转述。

只读写 origin 解析出的这一个项目。不实现需求，不创建 commit，不关闭，不删除，也不把其他仓库的 Issue 链到这一条。

## 确定目标项目

运行本技能目录下的解析脚本，参数为当前工作目录。这个脚本只解析 origin，不替代 GitLab 的解析脚本。

```bash
node <skill-dir>/scripts/resolve-project.mjs "$PWD"
```

脚本成功时输出 `host`、`owner`、`repoName`、`repo`。`repo` 是传给 `gh -R` 的值，形如解析出的 `host/owner/repoName`。主机来自 origin，不写死成 github.com 以外的地址。

完成标准：`gh auth status --hostname <host>` 成功。脚本或登录失败时停止，并报告脚本错误；不改用目录名、其他 remote，也不手写仓库名。origin 不是 GitHub，或解析不出 owner/repo 时，脚本会停止，本技能也停止。

## 判断动作

- 用户给出本仓库的 Issue 编号或 URL：只操作这一条。不搜索，不新建。
- 消息含有「远程 Issue 已创建，更新这一条，不要新建。」并且给出一条 Issue URL：这就是给出了这一条，并且要求更新描述。不是分析草稿，也不是新建。URL 可以在下一行，也可以在同一条消息里。这句话本身不写入正文。
- URL 的项目和 origin 解析出的项目不一致：停止，并说明两边的 host、owner、repo。不新建，不改 URL 那一侧，也不改 origin 这一侧。
- 编号和 URL 指向不同 Issue：停止。
- 没有编号、没有 URL、也没有上面这句更新句子时：明确说新建才创建，搜索到的相近 Issue 只在结果里提一句。要求创建但没说新建，就先搜索，同一事项已有开放 Issue 则更新那一条；没有开放的同一事项就停止，不新建。要求修改或评论但定位不到，就停止，不新建。
- 只说分析或草稿，又没有上面的更新句子：整理后放在回复里，不写入。
- 用户说完成某条 Issue：只整理并写入正文或评论。不提交代码，不关闭。

Issue URL 的路径是 `/<owner>/<repo>/issues/<编号>`。host、owner、repoName 与脚本输出比，三者都忽略大小写。不是 Issue URL 就停止。

完成标准：调用写入命令前只有一个动作。需要编号的动作已经确定到一条属于目标项目的 Issue。

## 整理说法

创建或修改描述时，正文只有这些节，只写已经说清的节。中文标题用：

```markdown
## 背景

## 要做什么

## 验收
```

用户用其他语言时，这三节仍是背景、要做的事、验收，标题随该语言。

第一次把口述或简短任务整理进正文时，「背景」里放用户原话，原样引用，并标明这是原始说法：

```markdown
## 背景

原始说法：

> 用户的原话
```

之后的更新先读现有正文，再整篇替换成当前已经说清的节。仍然有效的旧节保留。被否定的内容不留。没有说清的节不出现。这是重写当前事实，不是另附一份差异。

进展、结论、当前状态、验证结果和 commit 不进入正文。当前还没有任何说清的节时，不创建，也不改描述。

评论只理顺要说的话，不套这三节，也不改标题或正文。

正文和评论只写给人读的句子，让 Issue 保持当前开关状态。不写 `Fix`、`Fixes`、`Close`、`Closes`、`Resolve`、`Resolves` 加 Issue 编号或 URL。

完成标准：写入的正文只含已经说清的那些节。标题是一句问题或期望能力，只在创建时写入。用户这次没有明确要求改标题时，更新不动标题。

## 搜索同一事项

只在判断动作要求搜索或定位时搜索。

```bash
gh issue list -R <repo> --state open --search "<关键词>" --json number,title,body,url
```

读候选的标题和正文再判断。标题相近但事项不同的不合并。只把开放 Issue 当作可更新的同一事项。

完成标准：每个被当作同一事项的候选都读过正文。

## 写入

更新前先读这一条：

```bash
gh issue view <编号> -R <repo> --json title,body,url,state,labels,assignees,milestone
```

正文用 `mktemp` 写成临时文件，再整篇替换。不把该文件留在仓库里。

更新正文：

```bash
gh issue edit <编号> -R <repo> --body-file <临时文件>
```

创建：

```bash
gh issue create -R <repo> --title "<标题>" --body-file <临时文件>
```

命令里的 Issue 用编号，仓库用 `-R` 的 `repo`。不用 URL 充当另一个仓库。

元数据只传用户这次点名的标签、负责人、里程碑、截止日期，并且该参数要在当前命令的 `--help` 里。创建用 `--label`、`--assignee`、`--milestone`。更新用 `--add-label`、`--add-assignee`、`--milestone`。没点名的不传。help 里没有截止日期时，不把截止日期写进正文凑数，在回复里说明没写上。其余点了名但没写上的字段同样说明。

不关闭、不删除 Issue 或评论。用户要求关闭或删除时停止，不调用对应命令。

用户这次没有要求改正文时，不写正文文件。用户这次没有明确要求改标题时，不传 `--title`。

评论把理顺后的文字写入临时文件：

```bash
gh issue comment <编号> -R <repo> --body-file <临时文件>
```

写入后再 view 一次。

完成标准：回读的标题、正文，以及本次点名且已写上的字段，与刚写入的一致。回复完整 Issue URL、动作是创建、更新还是评论，以及点了名但没写上的字段。

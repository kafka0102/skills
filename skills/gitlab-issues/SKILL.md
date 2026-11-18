---
name: gitlab-issues
description: 管理当前仓库的 GitLab Issue：创建、修改标题或描述、发表评论，或只起草不写入。目标项目取当前目录的 git origin。不实现需求，也不提交代码。
---

# GitLab Issue

使用本机已登录的 `glab` 修改目标项目中的 GitLab Issue。参数以当前 `glab issue <command> --help` 为准。不保存 token，不打印凭据。

提交代码、commit message 和 `Refs` trailer 属于目标仓库自己的 git 规范。本技能不创建 commit。

## 确定目标项目

运行本技能目录下的解析脚本，参数为当前工作目录：

```bash
node <skill-dir>/scripts/resolve-project.mjs "$PWD"
```

脚本成功时输出 `host`、`projectPath`、`repo`。后续命令使用 `GITLAB_HOST=<host>`，`-R` 使用 `repo`。

完成标准：`glab auth status --hostname <host>` 成功。脚本或登录失败时停止，并原样报告脚本错误；不改用目录名、其他 remote，也不写死项目路径。

## 判断动作

- 只要分析或草稿：整理后放在回复里，不调用写入命令。
- 用户给出 Issue 编号或 URL：只操作这一条。
- 用户明确说新建：创建。搜索到的相近 Issue 只在结果里提一句。
- 用户要求创建但没说新建：先搜索。同一事项已有开放 Issue 时更新那一条。
- 用户要求修改但没给编号：定位同一事项的开放 Issue。定位不到就停止，不新建。
- 用户要求评论但没给编号：同样先定位。定位不到就停止。
- 用户说完成 Issue：说明本技能只整理并写入 Issue 正文或评论；代码提交仍由目标仓库的 git 规范处理。

完成标准：调用写入命令前只有一个动作，需要编号的动作已经确定到一条 Issue。

## 整理说法

创建，或修改描述时，把用户的短句整理成三节。中文使用这些标题：

```markdown
## 背景

## 要做什么

## 验收
```

用户用其他语言时，三节仍是背景、要做的事、验收，标题随该语言。只写用户已经表达的事实，以及 Issue 上已经写明且仍然有效的事实。缺的节写「未提供。」标题是一句问题或期望能力。

评论只理顺用户要说的话，不套这三节。

完成标准：Issue 描述只有这三节。描述和评论都不加入进展、结论、当前状态、验证结果或 commit。

## 搜索同一事项

```bash
GITLAB_HOST=<host> glab issue list -R <repo> --search "<关键词>" -O json
```

读候选的标题和描述再判断。标题相近但事项不同的不合并。

完成标准：每个被当作同一事项的候选都读过描述。

## 写入

创建和更新描述时，把正文写入临时文件，用 `--description-file` 传入。创建同时传 `-t` 和 `-y`。

只传用户在这次请求里点名的字段。没点名的标签、负责人、里程碑、截止日期不传。用户明确要求关闭点名的那一条时，先看 `glab issue close --help` 再关闭。不删除 Issue 或评论。

更新前先 `glab issue view <id> -R <repo> -F json`。不改用户没提的标题或描述。写入后再读一次。

评论：

```bash
GITLAB_HOST=<host> glab issue note <id> -R <repo> -m "<整理后的评论>"
```

完成标准：回读的标题、描述和本次点名字段与刚写入的一致。回复完整 Issue URL、动作是创建、更新还是评论，以及点了名但没写上的字段。

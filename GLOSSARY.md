# GitLab Issue

跨仓库管理 GitLab Issue 时使用的语言。目标项目由当前工作目录决定，不绑定某一个固定项目。

## Language

**目标项目**:
当前工作目录的 git origin 所指向的 GitLab 项目。
_Avoid_: 仓库, 当前目录, 技能仓库

**技能仓库**:
版本化 skill 源文件的 Git 仓库。
_Avoid_: 目标项目

**GitLab Issue**:
目标项目中的一条工单。
_Avoid_: ticket, 本地任务

**Issue 正文**:
GitLab Issue 的描述，由背景、要做的事和验收组成。
_Avoid_: 进展, 结论, 当前状态

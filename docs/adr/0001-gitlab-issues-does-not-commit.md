# Issue 技能不创建提交

`gitlab-issues` 供多个仓库创建和修改 GitLab Issue。itsm-risk 的 `gitlab-issue-workflow` 会在「完成 issue」时提交代码并追加 `Refs: #<issue-id>`。这个技能不这样做：提交说明由目标仓库自己的 git 规范负责。把提交放进本技能会让没有那套规范的仓库也在一句「完成 issue」下产生 commit。

不考虑把 `Refs` 写进本技能，也不在本技能里转去执行目标仓库的提交流程。

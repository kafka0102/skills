# skills

本仓库维护一组用于 AI 编码协作的 skill，覆盖从需求澄清、方案拆解、开发实现到 GitLab Issue 管理的常见流程。

## Skills

- **matt-dev-workflow**：封装 [Matt Pocock 的 skills 开发工作流](https://github.com/mattpocock/skills)，先通过交互厘清需求，再用 spec、tracer-bullet tickets、TDD 实现、代码审查和提交完成开发闭环。
- **matt-direct-dev-workflow**：与 `matt-dev-workflow` 共用需求澄清和任务拆解流程，但实现阶段采用非 TDD 的直接交付方式，收尾仍包含代码审查。
- **gitlab-matt-workflow**：以目标项目的一条 GitLab Issue 作为需求锚点，先澄清并完善 Issue，再衔接 `matt-dev-workflow` 完成后续开发。
- **gitlab-issues**：管理当前仓库对应 GitLab 项目的 Issue，包括创建、修改标题或描述、发表评论，以及只生成草稿而不写入；不负责实现需求或提交代码。
- **github-matt-workflow**：以目标项目的一条 GitHub Issue 作为需求锚点，先澄清并完善 Issue，再衔接 `matt-dev-workflow` 完成后续开发。Issue 读写走 `github-issues`。
- **github-issues**：管理当前仓库对应 GitHub 项目的 Issue，包括创建、修改描述、发表评论，以及只生成草稿而不写入；只用 `gh`，不负责实现需求或提交代码。

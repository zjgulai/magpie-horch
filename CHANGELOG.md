# Changelog — Magpie Horch

Magpie Horch 是基于 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 的桌面端 AI Agent Harness 产品，持续跟进 upstream 版本迭代，并融合自研功能组件。

---

## [magpie-horch-v0.1.2-alpha.1-pilot.1] — 2026-08-29

**基座版本**: deepseek-harness `dsh-v0.1.2-alpha.1`
**DMG 产物**: `Magpie Horch-0.1.2-alpha.1-pilot.1-arm64.dmg`
**SHA 基座 commit**: `cd5ef8148`

### 新增（来自 upstream alpha.1）

- **ACP 重构**：Agent Client Protocol 大幅重写，新增 MCP 协议支持、会话快照流、model-control 扩展
- **API Gateway 重写**：连接层全面重构，引入 stream-protocol / stream-server / stream-client，WebSocket downlink 退出
- **Session Controller**：`dsh-client-runtime` 拆分为 `dsh-api-session-controller` + `dsh-api-workspace-controller`
- **Webhook 支持**：新增 `webhook/webhook` 和 `webhook/webhook-github` 包，支持 GitHub webhook ingress
- **code-mode 重命名为 PTC**：全局重命名为 `ptc`（PTC mode）
- **浏览器认证**：`connection` 包新增 `browser-auth` 模块，支持 cookie 签名会话
- **新工具包**：`dsh-util-workspace-path`、`dsh-util-crypto`
- **Subagent lineage**：ui-workspace 新增 subagent lineage 视图

### Pilot 适配（兼容性修复）

| 变更 | 文件 |
|------|------|
| `dsh-client-runtime` 移除 → `@deepseek-ai/cordis` (ClientContext) | codepilot-theme / ui-worktree / ui-schedule-summary |
| `connection.rpc.handle()` options.authority 参数移除 | ui-worktree / ui-schedule-summary host half |
| `resolveWorkspacePath` 迁移到 `dsh-util-workspace-path` | ui-worktree client |
| `llm-pi-ai` catalog gate 补全 `thinking.budget` / `thinkingTokenBudgetField` / `allowedFallbackModels` | llm-pi-ai/catalog.ts |
| pnpm overrides 补全，防止未发布 alpha 版本解析失败 | package.json |

### 启动修复（code 1 崩溃）

alpha.1 合并后 `apps/desktop/package.json` 未同步上游依赖变动，导致 `dsh web` 子进程以 `code 1` 退出。同一版本号内追加修复，**无需重新打 tag**。

| 根因 | 修复 |
|------|------|
| `package.json` 缺少 89 个 alpha.1 运行时依赖（`dsh-settings`、`dsh-jobs`、`dsh-credentials` 等） | 从 `apps/cli/package.json` 同步全量 runtime deps |
| alpha.1 新增包（`ui-session`、`ui-approval`、`ui-chat`、`api-session-controller` 等）未构建 client bundle | `tsdown` 重建 10 个包的 `lib/` |
| `dsh-client-connection/lib` stale 内容引用已删除的 `dsh-host-apiproxy` | 重建 `client-connection` |

验证：`dsh web` 成功启动 `http://127.0.0.1:3080`，4 个 Electron 进程全部正常。

### 安装说明（macOS 26 Tahoe）

macOS 26 Gatekeeper 拒绝 ad-hoc 签名应用，打开时提示「文件已损坏」。解决方法：

```bash
# 将 magpie-horch.app 拖入 /Applications 后执行：
xattr -cr /Applications/magpie-horch.app
```

### 构建信息

```
electron-builder version: 26.15.3
Electron: 40.10.6
Target: macOS arm64 DMG + ZIP
Pack date: 2026-08-29 (修复重打包)
```

---

## [magpie-horch-v0.1.1-rc.2-pilot.1] — 2026-08-28

**基座版本**: deepseek-harness `dsh-v0.1.1-rc.2`
**DMG 产物**: `Magpie-Horch-v0.1.1-rc.2-pilot.1-arm64.dmg`
**SHA 基座 commit**: `aa6c361a9`

### 新增（来自 upstream rc.1 + rc.2）

- **多模态支持**：新增 `DeepSeek-V4-Flash-Vision-Exp` 模型，支持图片理解
- **Files API**：图像上传走 DeepSeek Files API，自动预处理超尺寸图片
- **Authorization 包**：新增 `@deepseek-ai/dsh-credentials-authorization` 凭据授权能力
- **Pi.ai 提供商**：新增 `llm-pi-ai` 登录与认证模块
- **Bubblewrap 沙箱**：安全加固，修复沙箱逃逸风险
- **UX 优化**：对话流、工具调用渲染改进

### Magpie Horch 品牌变更

- 产品名：`Magpie Horch`，∞ 橙金色图标
- 几何抽象喜鹊 Logo + HORCH 徽章 Wordmark
- 集成：dsh-better-sidebar、dsh-git-remotes、dsh-sentinel 等自研插件
- 完整 UI 品牌化（窗口标题/菜单/通知/favicon/app icon）

### 构建信息

```
electron-builder version: 26.15.3
Electron: 40.10.6
Target: macOS arm64 DMG + ZIP
Pack date: 2026-08-27
```

---

## [0.1.0-rc.8-pilot.1] — 2026-08-20

**基座版本**: deepseek-harness `dsh-v0.1.0-rc.8`
**DMG 产物**: `Pilot Harness-0.1.0-rc.8-pilot.1-arm64.dmg`
**SHA 基座 commit**: `141eb6fef`

### 新增（来自 upstream rc.8）

- 初始 Pilot Harness 桌面发行版
- 全功能 Agent 循环：工具调用、子 Agent、任务委托
- 4 个设置页面：通用 / 模型 / 插件 / Agent 预设
- 本地技能注册、Cordis 插件架构

### Pilot 初始化变更

- 图标替换为 op7418 GitHub 头像
- 产品名从 `DeepSeek Harness` 重命名为 `Pilot Harness`
- AppId 设置为 `app.op7418.pilot-harness`
- 添加 Router J-Space 插件（experimental）
- 配置 `upstream-sync.yml` 自动追踪 deepseek-ai/deepseek-harness

### 构建信息

```
electron-builder version: 26.15.3
Electron: 40.10.6
Target: macOS arm64 DMG + ZIP
Pack date: 2026-08-20
```

---

## 版本管理规则

| 字段 | 格式 | 示例 |
|---|---|---|
| 基座版本 | `dsh-vX.Y.Z-rc.N` | `dsh-v0.1.1-rc.2` |
| Pilot 版本 | `X.Y.Z-rc.N-pilot.M` | `0.1.1-rc.2-pilot.1` |
| DMG 文件名 | `Magpie-Horch-vX.Y.Z-rc.N-pilot.M-arch.dmg` | `Magpie-Horch-v0.1.1-rc.2-pilot.1-arm64.dmg` |
| Git tag | `magpie-horch-vX.Y.Z-rc.N-pilot.M` | `magpie-horch-v0.1.1-rc.2-pilot.1` |

- **基座追踪**：`.github/upstream.json` 记录当前追踪的 upstream tag/commit
- **自动同步**：`upstream-sync.yml` 每日 09:00 (CST) 检查 upstream 新 tag
- **Pilot 迭代**：在同一基座 rc 版本上的 Pilot 优化，`pilot.M` 递增（`M` 从 1 开始）

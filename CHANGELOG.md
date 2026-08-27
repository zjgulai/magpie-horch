# Changelog — Pilot Harness

Pilot Harness 是基于 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 的桌面发行版，每次 upstream 发布新 RC 版本后，在此仓库同步合并并打包发布。

---

## [0.1.1-rc.2-pilot.1] — 2026-08-27

**基座版本**: deepseek-harness `dsh-v0.1.1-rc.2`
**DMG 产物**: `Pilot Harness-0.1.1-rc.2-pilot.1-arm64.dmg`
**SHA 基座 commit**: `aa6c361a9`

### 新增（来自 upstream rc.1 + rc.2）

- **多模态支持**：新增 `DeepSeek-V4-Flash-Vision-Exp` 模型，支持图片理解
- **Files API**：图像上传走 DeepSeek Files API，自动预处理超尺寸图片
- **Authorization 包**：新增 `@deepseek-ai/dsh-credentials-authorization` 凭据授权能力
- **Pi.ai 提供商**：新增 `llm-pi-ai` 登录与认证模块
- **Bubblewrap 沙箱**：安全加固，修复沙箱逃逸风险
- **UX 优化**：对话流、工具调用渲染改进

### Pilot 保留变更

- 图标：op7418 GitHub 头像（1024×1024）
- 产品名：`Pilot Harness`（appId: `app.op7418.pilot-harness`）
- Router J-Space 插件（experimental）
- 品牌主题 CSS（`brand-icon.module.css`）

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
| DMG 文件名 | `Pilot Harness-X.Y.Z-rc.N-pilot.M-arch.dmg` | `Pilot Harness-0.1.1-rc.2-pilot.1-arm64.dmg` |
| Git tag | `vX.Y.Z-rc.N-pilot.M` | `v0.1.1-rc.2-pilot.1` |

- **基座追踪**：`.github/upstream.json` 记录当前追踪的 upstream tag/commit
- **自动同步**：`upstream-sync.yml` 每日 09:00 (CST) 检查 upstream 新 tag
- **Pilot 迭代**：在同一基座 rc 版本上的 Pilot 优化，`pilot.M` 递增（`M` 从 1 开始）

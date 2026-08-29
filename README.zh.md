# Magpie Horch

[English](README.md) | 中文

**Magpie Horch** 是基于 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 构建的桌面端 AI Agent Harness 产品，持续跟进 upstream 版本迭代，并融合自研功能组件。

> Magpie（喜鹊）= 聪明善记、衔接信息 · Horch（德语）= 精准聆听 — 善于聆听、精准衔接的 AI 助手

## 当前版本

| 字段 | 值 |
|------|-----|
| 产品版本 | `v0.1.2-alpha.1-pilot.1` |
| 基座 upstream | `deepseek-harness dsh-v0.1.2-alpha.1` |
| 发布平台 | macOS (Apple Silicon) |
| App 图标 | ∞ 橙金色（`#E8920A`） |

## 下载与安装

前往 [Releases](https://github.com/zjgulai/magpie-horch/releases) 下载最新 DMG。

### ⚠️ macOS 安装说明（重要）

本应用使用 **ad-hoc 签名**，尚未通过 Apple 公证。macOS 13 及以上（含 macOS 26 Tahoe）直接打开会提示「文件已损坏」，请按以下步骤操作：

1. 下载 DMG，挂载后将 `magpie-horch.app` 拖入 `/Applications`
2. 打开「终端」，执行：

```bash
xattr -cr /Applications/magpie-horch.app
```

3. 双击启动即可。

> 若仍提示无法打开，改用：`sudo xattr -d com.apple.quarantine /Applications/magpie-horch.app`

## 项目定位

本仓库承担三个职责：

1. **Magpie Horch 产品迭代** — upstream RC 合并、品牌定制、桌面打包发布
2. **自研插件融合** — `dsh-better-sidebar`、`dsh-git-remotes`、`dsh-sentinel` 等 harness 插件集成
3. **组件扩展开发** — 在 harness 架构上开发新的 UI 插件和 Agent 能力组件

## 架构简述

```
apps/desktop/     — Electron 桌面壳，打包为 DMG/ZIP 分发
apps/web/         — Web UI（由 desktop 内嵌，也可独立运行）
apps/cli/         — dsh CLI，启动本地 web 服务
packages/         — 核心能力包（会话、工具、插件系统、UI 组件）
vendor/           — vendored Cordis 框架
```

核心架构：**一切皆插件**（基于 [Cordis](https://github.com/cordiverse/cordis)），所有 Agent 能力（会话、工具、LLM 适配器、UI 组件）均作为 Cordis 插件挂载。

## 开发

```sh
git clone https://github.com/zjgulai/magpie-horch.git
cd magpie-horch
pnpm install
pnpm run build
# 启动桌面开发模式
pnpm --filter @deepseek-ai/dsh-desktop run dev
```

详见 [AGENTS.md](AGENTS.md)（AI 协作规范）和 [VERSIONING.md](VERSIONING.md)（版本管理规范）。

## Upstream 跟进

本仓库追踪 upstream `deepseek-ai/deepseek-harness`。每次 upstream 发布新 RC 后：

1. `git fetch upstream && git merge upstream/dsh-vX.Y.Z`
2. 解决冲突，保留 Magpie Horch 定制
3. 更新 `.github/upstream.json`
4. 打 tag `magpie-horch-vX.Y.Z-pilot.N` 并构建新 DMG

## 版本命名

```
magpie-horch-v{upstream_version}-pilot.{N}
```

示例：`magpie-horch-v0.1.2-alpha.1-pilot.1`

## License

[MIT](LICENSE) · Third-party notices: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)

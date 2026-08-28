> **范围说明**: 本模块为 upstream deepseek-ai/deepseek-harness 保留组件，非 Magpie Horch Desktop 核心路径。Magpie Horch 品牌化产品不依赖此模块。
>
> **Scope note**: This module is retained from the upstream deepseek-ai/deepseek-harness. It is not part of the Magpie Horch Desktop core product path.

# experimental/ — private experimental packages

English | [中文](README.zh.md)

This group contains prototypes and internal-only Cordis plugins that use the repository's real runtime without joining an official release. Its packages are private, carry no stability or support promise, and retain the same engineering, security, documentation, lifecycle, testing, and snapshot requirements as release packages.

| Package | Role | ctx key |
|---|---|---|
| `agent-team/` | Implicit-root Agent Teams roster, durable peer mailbox, shared task DAG, and runtime coordination | `ctx.agentTeams` |
| `tool-agent-team/` | Scoped model-facing Agent Teams tools and collaboration guidance | — |

The [subtree rules](AGENTS.md) define dependency isolation, release exclusion, and promotion.

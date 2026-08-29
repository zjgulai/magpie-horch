# Magpie Horch 版本管理规范

## 版本命名格式

```
magpie-horch-v{upstream_version}-pilot.{N}
```

| 字段 | 格式 | 示例 |
|------|------|------|
| upstream 版本 | `{major}.{minor}.{patch}-rc.{N}` | `0.1.1-rc.2` |
| pilot 迭代号 | `pilot.{N}`（从 1 开始） | `pilot.1` |
| 完整版本 | `magpie-horch-v{upstream}-pilot.{N}` | `magpie-horch-v0.1.2-alpha.1-pilot.1` |
| Git tag | 同完整版本 | `magpie-horch-v0.1.2-alpha.1-pilot.1` |
| DMG 文件名 | `Magpie-Horch-v{upstream}-pilot.{N}-{arch}.dmg` | `Magpie-Horch-v0.1.2-alpha.1-pilot.1-arm64.dmg` |

## Pilot 迭代号规则

- 每次合并新的 upstream RC 版本，`pilot.N` **重置为 1**
- 在同一 upstream 基座上的功能追加/品牌更新，`pilot.N` **递增**
- 纯修复 hotfix 可使用 `pilot.N.patch.M`（如 `pilot.1.patch.1`），但尽量并入下一个 pilot 迭代

## 当前版本状态

| 字段 | 值 |
|------|-----|
| 当前产品版本 | `magpie-horch-v0.1.2-alpha.1-pilot.1` |
| 当前 upstream 基座 | `dsh-v0.1.1-rc.2` (`b150a551b8`) |
| appId | `ai.magpiehorch.desktop` |
| productName | `Magpie Horch` |
| executableName | `magpie-horch` |

## Upstream 同步流程

1. **检查 upstream 新 tag**

   ```bash
   git fetch upstream
   git tag -l 'dsh-v*' --sort=-version:refname | head -5
   ```

2. **合并 upstream 新 RC**

   ```bash
   git merge upstream/dsh-vX.Y.Z-rc.N
   # 解决冲突，保留 Magpie Horch 定制
   ```

3. **更新追踪记录**

   编辑 `.github/upstream.json`：
   ```json
   {
     "repository": "deepseek-ai/deepseek-harness",
     "tag": "dsh-vX.Y.Z-rc.N",
     "commit": "<sha>",
     "pilotVersion": "magpie-horch-vX.Y.Z-rc.N-pilot.1"
   }
   ```

4. **更新 CHANGELOG.md**

   在顶部添加新的 `## [magpie-horch-vX.Y.Z-rc.N-pilot.1]` 条目。

5. **构建并发布**

   ```bash
   # 在 pilot-harness repo 完成 build
   pnpm run build

   # 在 apps/desktop 打包
   pnpm --filter @deepseek-ai/dsh-desktop run pack

   # 打 tag 并推送
   git tag magpie-horch-vX.Y.Z-rc.N-pilot.1
   git push zjgulai main --tags

   # 创建 GitHub Release 并上传 DMG
   gh release create magpie-horch-vX.Y.Z-rc.N-pilot.1 \
     --repo zjgulai/pilot-harness \
     --title "Magpie Horch vX.Y.Z-rc.N-pilot.1"
   ```

## 插件集成版本策略

自研插件（`dsh-better-sidebar`、`dsh-git-remotes`、`dsh-sentinel` 等）通过 `apps/desktop/package.json` 的 `dependencies` 字段锁定版本。

版本更新规则：
- 插件 patch 更新 → 直接更新 package.json，在同一 pilot 迭代中包含
- 插件新功能 → 视复杂程度决定是否触发新的 pilot 迭代号

## 文件命名约定

| 构件 | 命名规则 |
|------|----------|
| Git tag | `magpie-horch-v{版本}` |
| GitHub Release 标题 | `Magpie Horch v{版本}` |
| DMG 文件 | `Magpie-Horch-v{版本}-arm64.dmg` |
| ZIP 文件 | `Magpie-Horch-v{版本}-arm64.zip` |

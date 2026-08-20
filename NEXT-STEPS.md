# Pilot Harness RC.8 恢复工作 - 后续步骤

**当前状态**: ✅ 核心恢复工作完成

---

## 已完成工作（✅）

### 阶段 0-1: 源码恢复与适配
- ✅ 备份 /Applications/Pilot Harness.app
- ✅ 从 Git 恢复 ui-worktree 和 ui-schedule-summary 源码
- ✅ 完成 RC.8 API 适配（slot 迁移、图标替换、类型修复）
- ✅ 所有 packages 构建成功（`pnpm run build:lib`）
- ✅ 创建 12 个 Git commits
- ✅ 创建 Git tag: `v1.0.0-rc.8-recovered`

### 文档产出
- ✅ `RECOVERY-REPORT.md` - 完整恢复报告
- ✅ `PLUGIN-EVALUATION.md` - 10 个本地插件评估
- ✅ `DSH-UI-SCHEDULE-SUMMARY-COMPARISON.md` - 版本对比
- ✅ `NEXT-STEPS.md` - 本文档

---

## 待执行步骤

### 步骤 1: Desktop 应用测试（高优先级）

**目的**: 验证 Electron 应用可以正常启动和运行

**执行方式**:
```bash
cd /Users/lute/Project/my_dsh/pilot-harness/apps/desktop
pnpm run dev
```

**验证点**:
- [ ] Electron 窗口正常打开
- [ ] Console 无严重错误
- [ ] 三个 pilot 插件（ui-codepilot-theme, ui-worktree, ui-schedule-summary）正常加载
- [ ] 基本对话功能正常
- [ ] 文件树可以展开（ui-worktree）
- [ ] 主题颜色正常（ui-codepilot-theme）

**如果失败**:
1. 检查 Console 错误日志
2. 检查 `apps/desktop/dist/` 构建产物
3. 运行 `pnpm run build` 重新构建 apps/desktop
4. 检查 `apps/desktop/package.json` 依赖是否完整

---

### 步骤 2: 集成本地插件（中优先级）

**前提**: 步骤 1 通过

**要集成的插件**（8个）:
1. dsh-ui-files
2. dsh-ui-provider-catalog
3. dsh-spotlight
4. dsh-file-mentions
5. dsh-view-modes
6. dsh-settings-tuner
7. dsh-sticky-disclosure
8. dsh-noema（可选）

**执行方式**:

#### 2.1 创建符号链接
```bash
cd /Users/lute/Project/my_dsh/pilot-harness/packages/client/

# 创建到本地插件的符号链接
ln -s ../../../plugins/dsh-ui-files ui-files
ln -s ../../../plugins/dsh-ui-provider-catalog ui-provider-catalog
ln -s ../../../plugins/dsh-spotlight spotlight
ln -s ../../../plugins/dsh-file-mentions file-mentions
ln -s ../../../plugins/dsh-view-modes view-modes
ln -s ../../../plugins/dsh-settings-tuner settings-tuner
ln -s ../../../plugins/dsh-sticky-disclosure sticky-disclosure
# 可选
ln -s ../../../plugins/dsh-noema noema
```

#### 2.2 更新 apps/desktop/package.json
在 `dependencies` 中添加：
```json
{
  "dependencies": {
    "@local/dsh-ui-files": "workspace:*",
    "@local/dsh-ui-provider-catalog": "workspace:*",
    "@0xsline/dsh-spotlight": "workspace:*",
    "dsh-file-mentions": "workspace:*",
    "dsh-view-modes": "workspace:*",
    "dsh-settings-tuner": "workspace:*",
    "dsh-sticky-disclosure": "workspace:*"
  }
}
```

#### 2.3 重新安装依赖
```bash
cd /Users/lute/Project/my_dsh/pilot-harness
pnpm install
```

#### 2.4 验证
```bash
pnpm run build:lib
cd apps/desktop && pnpm run dev
```

**验证点**:
- [ ] 所有新插件构建成功
- [ ] Electron 启动无错误
- [ ] 新功能可用（文件侧边栏、命令面板、设置调整等）

---

### 步骤 3: 打包测试（高优先级）

**前提**: 步骤 1 或步骤 2 通过

**执行方式**:
```bash
cd /Users/lute/Project/my_dsh/pilot-harness/apps/desktop
pnpm run pack
```

**验证点**:
- [ ] `.dmg` 文件成功生成
- [ ] 检查 `dist/mac-arm64/` 或 `dist/mac/` 目录
- [ ] `.dmg` 文件大小合理（预计 100-200MB）

---

### 步骤 4: 安装并验证打包产物

**执行方式**:
```bash
# 1. 卸载旧版本
rm -rf "/Applications/Pilot Harness.app"

# 2. 打开新生成的 .dmg
open /Users/lute/Project/my_dsh/pilot-harness/apps/desktop/dist/*.dmg

# 3. 拖拽安装到 /Applications/

# 4. 启动应用
open "/Applications/Pilot Harness.app"
```

**验证点**:
- [ ] 应用正常启动
- [ ] 所有插件正常加载
- [ ] 基本功能测试通过
- [ ] 无崩溃或严重错误

---

### 步骤 5: 处理 ui-schedule-summary 冲突（低优先级）

**背景**:
- pilot 版本功能残缺（组件被删除）
- 本地版本功能完整
- 建议未来用本地版本替换

**执行方式**（可选）:
```bash
cd /Users/lute/Project/my_dsh/pilot-harness

# 删除 pilot 残缺版本
rm -rf packages/schedule/ui-schedule-summary

# 集成本地完整版本
cd packages/schedule/
ln -s ../../../plugins/dsh-ui-schedule-summary ui-schedule-summary

# 更新依赖并重新构建
cd ../..
pnpm install
pnpm run build:lib
```

---

## 常见问题排查

### Q1: pnpm run dev 失败
**排查步骤**:
1. 检查 `pnpm run build:lib` 是否成功
2. 检查 `apps/desktop/dist/` 是否有构建产物
3. 运行 `pnpm run build` 重新构建 desktop
4. 检查 Console 日志中的具体错误

### Q2: Electron 窗口无法打开
**排查步骤**:
1. 检查系统日志：`Console.app` 搜索 "Electron"
2. 检查 `apps/desktop/src/main.ts` 入口文件
3. 尝试直接运行：`./node_modules/.bin/electron .`
4. 检查 macOS 安全设置（系统偏好设置 > 安全性与隐私）

### Q3: 插件加载失败
**排查步骤**:
1. 检查 `apps/desktop/package.json` dependencies
2. 运行 `pnpm ls` 查看依赖树
3. 检查插件的 `package.json` 是否正确
4. 重新运行 `pnpm install`

### Q4: 打包失败
**排查步骤**:
1. 检查 `apps/desktop/package.json` 中的 `build` 配置
2. 清理并重新构建：
   ```bash
   rm -rf dist/
   pnpm run build
   pnpm run pack
   ```
3. 检查磁盘空间是否充足
4. 查看完整的 pack 日志

---

## 技术债务提醒

### 高优先级
- [ ] **WorktreeSessionDetail** 功能缺失
  - 原因: `sidebar.workspaces.session.detail` slot 在 rc.8 中不存在
  - 解决方案: 跟踪上游更新，一旦 slot 恢复立即启用

- [ ] **ScheduleSessionDetail** 功能缺失
  - 同上

### 中优先级
- [ ] **ui-worktree 右侧栏降级**
  - 当前: 对话视图中的标签页
  - 期望: 独立的右侧边栏
  - 解决方案: 等待 `shell.right-sidebar` slot 恢复

### 低优先级
- [ ] 本地插件未集成（8个）
- [ ] ui-schedule-summary 使用残缺版本

---

## 回滚方案

如果新版本出现严重问题，可以回滚到备份：

```bash
# 1. 卸载新版本
rm -rf "/Applications/Pilot Harness.app"

# 2. 恢复备份（查找最新备份）
ls -lt /Users/lute/backup_pilot_harness_* | head -1

# 3. 复制回 /Applications/
cp -R /Users/lute/backup_pilot_harness_YYYYMMDD_HHMMSS/ \
  "/Applications/Pilot Harness.app"

# 4. 启动旧版本
open "/Applications/Pilot Harness.app"
```

---

## 联系与支持

如果遇到无法解决的问题：

1. **查看日志**:
   - macOS Console.app
   - `apps/desktop/dist/` 构建日志
   - Electron DevTools Console

2. **Git 历史**:
   ```bash
   git log --oneline -20
   git show <commit-hash>
   ```

3. **回退到特定 commit**:
   ```bash
   git reset --hard <commit-hash>
   pnpm install
   pnpm run build:lib
   ```

---

## 成功标准

### 最小可接受标准
- ✅ Electron 应用可以启动
- ✅ 基本对话功能正常
- ✅ 三个 pilot 插件正常加载

### 完整成功标准
- ✅ 所有上述 + 8 个本地插件集成
- ✅ 打包成功并可安装
- ✅ 所有功能测试通过

---

**文档更新时间**: 2026-08-20
**下次检查**: Desktop 应用测试后更新本文档

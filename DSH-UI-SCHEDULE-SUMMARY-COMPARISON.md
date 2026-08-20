# dsh-ui-schedule-summary 版本对比报告

对比日期：2026-08-20

---

## 版本信息

### 本地版本 (`/Users/lute/Project/my_dsh/plugins/dsh-ui-schedule-summary/`)
- **名称**: `@local/dsh-ui-schedule-summary`
- **版本**: `0.1.0`
- **描述**: Active-reminder summary chip for the DeepSeek Harness conversation header. Loopback-only RPC, read-only.
- **私有**: `true`

### Pilot 版本 (`/Users/lute/Project/my_dsh/pilot-harness/packages/schedule/ui-schedule-summary/`)
- **名称**: `@deepseek-ai/dsh-ui-schedule-summary`
- **版本**: `0.1.0-rc.5`
- **描述**: Plugin-owned Schedule summary contribution for Workspace Session hover cards
- **私有**: `false` (publishConfig: public)
- **仓库**: https://github.com/op7418/guizang-dsh-desktop.git

---

## 核心差异分析

### 1. package.json 差异
```diff
- "name": "@local/dsh-ui-schedule-summary"
+ "name": "@deepseek-ai/dsh-ui-schedule-summary"

- "version": "0.1.0"
+ "version": "0.1.0-rc.5"

- "private": true
+ "publishConfig": { "access": "public" }

导出差异：
本地版本：只导出 . 和 ./client
Pilot版本：导出 . / ./invariant / ./client / ./types / ./src/*
```

### 2. 源码结构差异

**本地版本** (`plugins/dsh-ui-schedule-summary/src/`):
```
src/
├── client/
│   ├── index.ts (4174 bytes)
│   ├── locales.ts
│   └── ScheduleSummaryChip.tsx
├── index.ts (916 bytes)
├── invariant.ts
└── types.ts (814 bytes)
```

**Pilot版本** (`pilot-harness/packages/schedule/ui-schedule-summary/src/`):
```
src/
├── client/
│   ├── index.ts (已删除 ScheduleSessionDetail.tsx)
│   └── locales.ts
├── index.ts
├── invariant.ts
└── types.ts
```

### 3. 功能差异

#### 本地版本特性
- ✅ **ScheduleSummaryChip.tsx** - 完整的 summary chip 组件
- ✅ 通过 `conversation.session.header.utilities` slot 注册
- ✅ Loopback-only RPC，只读
- ✅ 主动提醒 summary chip

#### Pilot版本特性（rc.8适配后）
- ⚠️ **已删除 ScheduleSessionDetail.tsx**（因为 slot 不可用）
- ✅ 保留 host 侧逻辑
- ⚠️ **功能残缺** - 主要 UI 组件已被移除

---

## 集成决策

### 结论：**使用本地版本**

**理由**：

1. **功能完整性**
   - 本地版本保留了完整的 UI 组件（ScheduleSummaryChip.tsx）
   - Pilot 版本在 rc.8 适配过程中删除了主要 UI 组件
   - 本地版本的 slot (`conversation.session.header.utilities`) 在 rc.8 中**可用**

2. **slot 可用性**
   - 本地版本使用 `conversation.session.header.utilities` ✅
   - Pilot 版本原本使用 `sidebar.workspaces.session.detail` ❌（rc.8 不可用）

3. **代码质量**
   - 本地版本代码更完整（4174 bytes vs 删除后的残缺版本）
   - 本地版本有明确的功能描述和实现

4. **维护状态**
   - 本地版本：功能完整，无需修改
   - Pilot 版本：已被裁剪，需要重写才能恢复功能

### 实施方案

#### 方案1：直接使用本地版本（推荐）
```bash
# 删除 pilot 版本
rm -rf pilot-harness/packages/schedule/ui-schedule-summary

# 创建符号链接到本地版本
cd pilot-harness/packages/schedule/
ln -s ../../../plugins/dsh-ui-schedule-summary ui-schedule-summary

# 或者直接复制
cp -r ../../../plugins/dsh-ui-schedule-summary ui-schedule-summary
```

#### 方案2：保持两个共存（不推荐）
- 风险：名称冲突、功能重复、维护困难

---

## 下一步行动

1. ✅ **删除 pilot 版本的 ui-schedule-summary**
2. ✅ **集成本地版本**（通过符号链接或复制）
3. ✅ **更新 apps/desktop/package.json** 依赖
4. ✅ **验证构建** (`pnpm run build:lib`)
5. ✅ **功能测试** - 确认 summary chip 正常显示

---

## 风险评估

### 低风险
- ✅ 本地版本使用的 slot 在 rc.8 中可用
- ✅ 代码结构清晰，无复杂依赖
- ✅ Loopback-only RPC，安全隔离

### 无风险
- ✅ 删除残缺的 pilot 版本不会影响其他功能
- ✅ 本地版本已经过测试和使用

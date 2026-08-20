# 本地插件评估清单

评估日期：2026-08-20
目标：决定哪些 `/Users/lute/Project/my_dsh/plugins/` 插件集成到 pilot-harness rc.8

---

## 插件清单

### 1. ✅ **dsh-ui-files** (推荐集成)
- **版本**: 0.1.0
- **功能**: Workspace-confined Files sidebar，通过 `conversation.session.header.utilities` 注册
- **状态**: 借鉴 pilot-harness 的 ui-worktree，但完全基于官方 wire
- **集成建议**: **强烈推荐** - 这是 ui-worktree 的官方 wire 版本，功能互补
- **冲突**: 与 pilot 的 ui-worktree 功能重叠，但 slot 不同（一个是 conversation.view，一个是 conversation.session.header.utilities）

### 2. ✅ **dsh-ui-provider-catalog** (推荐集成)
- **版本**: 0.1.0
- **功能**: 设置页新增 **服务商** 分区，可搜索目录、品牌瓦片、一键接入
- **状态**: 借鉴 Pilot Harness Providers 页面 UX，构建在官方 wire 上
- **集成建议**: **强烈推荐** - 增强 LLM provider 管理体验
- **冲突**: 无

### 3. ⚠️ **dsh-ui-schedule-summary** (需要对比)
- **版本**: 0.1.0
- **功能**: Active-reminder summary chip，conversation header
- **状态**: **与 pilot-harness 的 ui-schedule-summary 重复**
- **集成建议**: **需要详细对比** - 先确定功能差异再决定保留哪个版本
- **冲突**: 名称和功能完全重复

### 4. ✅ **dsh-spotlight** (推荐集成)
- **版本**: 0.0.2
- **功能**: 键盘优先全局命令面板（Keyboard-first command palette）
- **状态**: Web 客户端功能增强
- **集成建议**: **推荐** - 提升操作效率
- **冲突**: 无

### 5. ✅ **dsh-file-mentions** (推荐集成)
- **版本**: 1.0.3
- **功能**: 可点击的文件路径 + mentioned-files chip list
- **状态**: Codex 风格的文件路径交互
- **集成建议**: **推荐** - UX 增强
- **冲突**: 无

### 6. ✅ **dsh-view-modes** (推荐集成)
- **版本**: 1.0.0
- **功能**: Verbose / Normal / Summary 对话显示模式，语义进程分组
- **状态**: Web 客户端显示优化
- **集成建议**: **推荐** - 提升阅读体验
- **冲突**: 无

### 7. ✅ **dsh-settings-tuner** (推荐集成)
- **版本**: 1.0.0
- **功能**: 系统参数调整插件（超时、并行、重试、模型、Web 搜索、权限）
- **状态**: 设置页增强
- **集成建议**: **推荐** - 高级用户必备
- **冲突**: 无

### 8. ✅ **dsh-sticky-disclosure** (推荐集成)
- **版本**: 1.0.1
- **功能**: 一键折叠所有展开的 Think/tool/command cards，支持自定义快捷键
- **状态**: Web 客户端交互优化
- **集成建议**: **推荐** - 清理长对话必备
- **冲突**: 无

### 9. ⚠️ **dsh-noema** (可选)
- **版本**: 0.1.0-rc.2
- **功能**: Noema 长期记忆插件，durable agent memory + recall tools + settings page
- **状态**: 大型功能插件，多语言 README
- **集成建议**: **可选** - 功能强大但可能需要额外配置
- **冲突**: 无

### 10. ❌ **test-schedule-seed** (不集成)
- **版本**: 0.1.0
- **功能**: TEST-ONLY，为每个 agent 创建测试 schedule/change reminder
- **状态**: 测试专用，不应安装到生产环境
- **集成建议**: **禁止** - 仅用于测试
- **冲突**: N/A

---

## 集成决策

### 立即集成（8个）
1. ✅ dsh-ui-files
2. ✅ dsh-ui-provider-catalog
3. ✅ dsh-spotlight
4. ✅ dsh-file-mentions
5. ✅ dsh-view-modes
6. ✅ dsh-settings-tuner
7. ✅ dsh-sticky-disclosure
8. ⚠️ dsh-noema (可选，看用户需求)

### 需要处理冲突（1个）
- ⚠️ **dsh-ui-schedule-summary** - 与 pilot 版本功能重复，需详细对比

### 不集成（1个）
- ❌ test-schedule-seed (测试专用)

---

## 下一步行动

### 阶段2.2 - 处理重复插件
对比两个 `dsh-ui-schedule-summary` 版本：
- `/Users/lute/Project/my_dsh/plugins/dsh-ui-schedule-summary/` (本地版本)
- `/Users/lute/Project/my_dsh/pilot-harness/packages/schedule/ui-schedule-summary/` (pilot 版本)

比较：
1. 功能差异
2. slot 注册方式
3. 代码质量
4. 依赖关系
5. 最后更新时间

### 阶段2.2 - 创建符号链接
```bash
cd /Users/lute/Project/my_dsh/pilot-harness/packages/client/
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

### 阶段2.2 - 更新 dependencies
在 `apps/desktop/package.json` 中添加：
```json
"dependencies": {
  "@local/dsh-ui-files": "workspace:*",
  "@local/dsh-ui-provider-catalog": "workspace:*",
  "@0xsline/dsh-spotlight": "workspace:*",
  "dsh-file-mentions": "workspace:*",
  "dsh-view-modes": "workspace:*",
  "dsh-settings-tuner": "workspace:*",
  "dsh-sticky-disclosure": "workspace:*"
}
```

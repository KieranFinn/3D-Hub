# 3D Hub 架构文档

> AI 角色创建实验室 - 技术架构说明

## 版本

- **v1.0**: 单文件 HTML，原型验证
- **v1.1**: 模块化重构，引入状态管理层

---

## 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer (HTML)                      │
│   滑杆 / 文本输入 / 预设按钮 / 保存按钮                      │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    Controls Layer (controls.js)               │
│   事件监听 → 更新 State / 应用预设 / 文本解析                │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                     State Layer (state.js)                    │
│   统一角色参数对象 / 状态订阅机制 / 导入导出                  │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                  Character Layer (character.js)              │
│   applyCharacterConfig() → 更新 3D 网格                       │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                  Renderer Layer (renderer.js)                │
│   Three.js 场景 / 相机 / OrbitControls / 渲染循环            │
└───────────────────────────────────────────────────────────────┘
```

---

## 目录结构

```
3dhub/
├── index.html          # 入口页面
├── css/
│   └── style.css      # 样式
├── js/
│   ├── main.js        # 初始化入口
│   ├── state.js       # 状态管理层（核心）
│   ├── character.js   # 角色模型层
│   ├── renderer.js    # Three.js 渲染层
│   └── controls.js    # UI 控件层
├── data/
│   └── presets.json   # 预设数据
└── docs/
    └── ARCHITECTURE.md
```

---

## 核心模块

### State (state.js)

**职责**: 统一角色参数对象，所有模块的数据源

```javascript
const characterState = {
    face: { shape: 1.0, size: 1.0 },
    eyes: { size: 1.0, spacing: 1.0, color: '#333333' },
    nose: { size: 1.0 },
    mouth: { width: 1.0, curve: 0.5 },
    hair: { style: 'short', color: '#2a1810' },
    style: 'realistic'
};
```

**导出函数**:
- `getCharacterState()` - 获取只读副本
- `updateCharacterState(newState)` - 更新状态并通知监听器
- `subscribeToChanges(callback)` - 订阅状态变化
- `exportCharacterConfig()` - 导出 JSON
- `importCharacterConfig(json)` - 导入 JSON

---

### Character (character.js)

**职责**: 3D 角色网格的创建和更新

**核心函数**:
- `applyCharacterConfig(config)` - 统一入口，根据参数更新网格

---

### Renderer (renderer.js)

**职责**: Three.js 渲染器管理

**功能**:
- 场景、相机、渲染器初始化
- OrbitControls 轨道控制器
- 响应式窗口处理
- 渲染循环

---

### Controls (controls.js)

**职责**: UI 事件处理

**功能**:
- 滑杆事件 → 更新 state
- 预设按钮 → 批量应用参数
- 文本输入 → 假数据解析（后续接入 LLM）
- 保存/重置功能

---

## 数据流

```
用户操作（滑杆/文本/预设）
    ↓
controls.js 事件处理
    ↓
updateCharacterState(newState)
    ↓
通知所有订阅者
    ↓
    ├── controls.js → 同步 UI 显示
    └── character.js → 更新 3D 网格
```

---

## 未来扩展方向

### 待接入能力

1. **文本解析层** (text-parser.js)
   - 接入 LLM API
   - 文本 → 参数映射

2. **资产层** (待建)
   - GLB 模型加载
   - 材质/贴图管理
   - 发型/服装切换

3. **导出层** (待建)
   - GLB 模型导出
   - 打印参数输出

### 架构升级路径

1. **v1.1** (当前): 模块化基础架构 ✅
2. **v1.2**: 文本 → LLM → 参数
3. **v2.0**: 真实 GLB 模型 + 资产系统
4. **v2.1**: 导出功能 + 保存系统

---

## 开发指南

### 添加新的滑杆

1. 在 `index.html` 添加滑杆 HTML
2. 在 `state.js` 的 `defaultCharacter` 中添加默认参数
3. 在 `controls.js` 的 `bindSliderEvents` 中注册事件
4. 在 `character.js` 的 `applyCharacterConfig` 中处理更新

### 添加新的预设

1. 在 `data/presets.json` 中添加预设数据
2. 在 `controls.js` 的 `applyPresetByName` 中添加预设逻辑

---

## 技术栈

- **Three.js**: 3D 渲染 (v0.160.0)
- **OrbitControls**: 相机控制
- **原生 ES Modules**: 模块化
- **无框架**: 轻量级原型

---

## 关于

- **作者**: K (Kieran's AI)
- **版本**: v1.1
- **日期**: 2026-03-23

# 🎯 3D-Hub Roadmap & TODO

> Last updated: 2026-04-02

---

## 🔥 Phase 1: AI 生成链路验证（本周）

### 2D 概念生成
- [ ] Midjourney 生成 Q版角色概念图
  - prompt 模板: `character turnaround sheet, front side back view, white background, chibi style, vinyl toy --style raw`
  - 目标: 生成 5 组不同风格的角色三视图
- [ ] 测试 Stable Diffusion + LoRA 的风格一致性控制
- [ ] 建立 prompt 模板库（Q版/写实/赛博/复古）

### 2D → 3D 自动转换
- [ ] 注册并测试 [Meshy.ai](https://meshy.ai) — 图片→3D
- [ ] 注册并测试 [混元3D](https://3d.hunyuan.tencent.com) — 腾讯方案
- [ ] 测试 [Tripo3D](https://tripo3d.ai) — 单图→3D
- [ ] 对比三个工具的输出质量：拓扑干净度 / 面数 / 细节保留
- [ ] 选定主力工具，记录最佳参数配置
- [ ] 验证输出模型能否直接导入 ZBrush 精修

### 验证完整链路
- [ ] 完成一个 Midjourney→Meshy/混元→ZBrush→STL 的完整 demo
- [ ] 记录各环节耗时和瓶颈

---

## 🛠️ Phase 2: ZBrush 精修能力（2-4周）

### 核心技能（只需这4个）
- [ ] **Move 笔刷** — 调整比例和大型
- [ ] **Smooth 笔刷** — 磨平 AI 生成的噪点和锯齿
- [ ] **DynaMesh** — 统一拓扑，让 AI 模型可编辑
- [ ] **Decimation Master** — 减面导出，适配 3D 打印

### 进阶（按需）
- [ ] Dam Standard — 刻线
- [ ] Inflate — 鼓起效果
- [ ] Slice Curve / Split — 拆件
- [ ] Polypaint — 直接在模型上画色彩指定

### 里程碑
- [ ] 完成第一个 AI 生成 → 人工精修的完整角色
- [ ] 精修时间控制在 4 小时以内

---

## 🖨️ Phase 3: 实体出样（第2个月）

### 拆件
- [ ] 学习拆件基础（脱模方向 / 壁厚 / 榫卯卡扣）
- [ ] 拆件线藏在自然缝隙（发际线/衣服边缘/帽檐下）
- [ ] 每个零件壁厚 1.5-3mm，考虑 PVC 缩水率 ~1.5-2%

### 3D 打印
- [ ] 导出 STL / OBJ
- [ ] 光固化（SLA）打印白模 — Elegoo Saturn
- [ ] 检查：比例 / 拆件组装 / 死角
- [ ] 迭代修正 2-3 轮

### 上色
- [ ] 手涂丙烯/喷漆基础练习
- [ ] 完成第一个上色成品
- [ ] 拍照发社交媒体

---

## 🔗 Phase 4: 接入 3D-Hub 平台（第3个月）

### AI Pipeline 集成
- [ ] 在 3D-Hub 前端加入 AI 生成入口
  - 用户输入文字描述 → 调 Meshy/混元 API → 返回 3D 模型
- [ ] 支持从 AI 生成模型直接进入参数微调界面
- [ ] 增加 "Pop Mart 风格" preset 到 `data/presets.json`

### 导出增强
- [ ] 支持导出 STL（3D打印用）
- [ ] 支持导出带拆件标记的模型
- [ ] 支持导出 GLB/GLTF（通用 3D 格式）

---

## 📦 工具链

| 环节 | 工具 | 成本 | 备注 |
|------|------|------|------|
| 2D 概念 | Midjourney | $10/月 | `--style raw` 减少 AI 味 |
| 2D→3D | Meshy.ai / 混元3D / Tripo3D | 免费额度 | 对比选型 |
| 3D 精修 | ZBrush | $40/月 | 学生可免费 |
| 3D 打印 | Elegoo Saturn | ¥2000 | 一次性投入 |
| 树脂 | 标准光敏树脂 | ¥100-200/瓶 | 够打十几个 |
| 上色 | 丙烯/喷漆套装 | ¥200-300 | 入门级 |

---

## 🧠 核心思路

```
Midjourney 生成概念图（5分钟）
    ↓
Meshy/混元3D 一键转3D（10分钟）
    ↓
ZBrush 精修（几小时）
    ↓
3D-Hub 平台微调 + 导出
    ↓
3D打印出实体样品
```

**AI 替代最贵的两个环节：**
- 设计师（传统成本 ¥50K+）→ Midjourney ¥0
- 3D 雕刻师（月薪 1.5-3万）→ AI 生成 + 轻量精修

---

*Keep shipping. 🚀*

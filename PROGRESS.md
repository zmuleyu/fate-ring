# Fate Ring 进度跟踪

## Phase 1 — CSS 3D 轮盘 + 选牌流程
- [x] 项目结构初始化（React 19 + Vite + TypeScript）
- [x] 22张大阿尔卡纳 SVG 占位牌 + card_back.svg
- [x] CSS 3D 卡牌环形布局（透视深度缩放）
- [x] 拖拽旋转 + 惯性滚动 + 卡位吸附（useCardRing）
- [x] 选牌槽位 + CSS flip 翻牌动画（CardSlot）
- [x] selection → reading 页面流转
- [x] 暗紫金色视觉主题（星空背景 + 金色边框）
- [x] TypeScript build 零错误，dev server 运行验证

## Phase 2 — AI 解读 ✅
- [x] FastAPI 后端初始化（requirements.txt + main.py + CORS）
- [x] POST /api/reading 路由（接收 3 张牌 + 位置）
- [x] Gemini API 解读服务（gemini-2.5-flash-preview-04-17，10s 超时）
- [x] Claude API fallback 服务（claude-haiku-4-5）
- [x] Prompt 模板（中文塔罗师角色 + JSON 输出格式）
- [x] 前端 api.ts 服务层
- [x] ReadingResult 接入真实 AI 解读 + loading 页面 + 逆位支持
- [x] 路由逻辑验证（Gemini → Claude fallback 正常触发）
- [x] 配置 .env（SiliconFlow 作为三级 fallback，本地已验证）
- [x] curl E2E 验证（CORS + AI 解读 → 正常返回中文塔罗解读）
- [x] 前端 dev server 运行（http://localhost:5173，.env.local → VITE_API_URL=http://localhost:8001）

## Phase 3 — 手势控制 ✅
- [x] @mediapipe/tasks-vision 安装
- [x] useHandGesture.ts（摄像头+骨架检测+手势识别）
- [x] HandTracker.tsx（右上角预览窗+骨架绘制+手势闪显）
- [x] 手势映射：腕部连续追踪→旋转轮盘（含惯性）/ 捏合→选牌 / 张开→重置
- [x] 无摄像头自动降级鼠标模式
- [x] 新用户手势操作指南面板
- [x] 连续 wristX 驱动（替代离散跳格）→ 自然旋转 + 惯性滑动
- [x] build 零错误

## Phase 4 — 视觉升级 ✅
- [x] @react-three/fiber + drei 接入
- [x] StarsCanvas 全屏 Three.js 星空（6000 粒子，fade 旋转）
- [x] ThreeCardRing — 22 张牌 3D 平面环形，active 牌金色发光
- [x] 选牌金色粒子爆发（Sparkles）
- [x] useSoundFX — Web Audio API 三种音效（选牌/重置/揭示）
- [x] SVG → Canvas 2D 纹理（WebGL 不支持 SVG 纹理）
- [x] camera far=2000（修复后排牌被 near/far 裁剪）
- [x] isDragging useRef 守卫（修复首帧拖拽丢失的 stale closure）
- [x] setPointerCapture + useCallback 优化
- [x] build 零 TS 错误

## Phase 5 — 视觉 + 交互升级 ✅
- [x] 22 张独特卡背纹理（Canvas 2D Path API，每张大阿尔卡纳独特图案）
- [x] 选牌从环中消失（visible gap，取代半透明）
- [x] 环闪光脉冲（选牌瞬间所有卡牌 emissive 闪一下）
- [x] 同心圆发光中心指示器（替代竖线，CSS box-shadow 多层）
- [x] 金色弧线拖尾（CSS animation，选牌时飞向槽位）
- [x] 选牌槽位即刻翻正面（autoReveal prop，250ms 延迟翻牌）
- [x] "揭示命运" 按钮脉冲动画（btn-reveal--pulse）
- [x] Reading 页罗马数字圆形徽章（Ⅰ/Ⅱ/Ⅲ 带金色圆圈边框）
- [x] Reading 页英文位置标签（PAST/PRESENT/FUTURE）
- [x] Reading 页大卡牌展示（card-slot--large 130×226）
- [x] Reading 页逐块淡入滑入（CSS animation-delay 阶梯）
- [x] build 零 TS 错误

### 新增文件
- `frontend/src/components/cardMotifs.ts` — 22 张 Canvas Path 图案绘制

## Phase 5 稳定性修复 ✅
- [x] MediaPipe delegate: GPU → CPU（消除第3个WebGL上下文，防崩溃）
- [x] 检测 loop try-catch（防单帧异常杀死整个 rAF 循环）
- [x] onloadeddata null 守卫（防组件卸载后操作 videoRef）
- [x] App.css 重复声明清理（5组 duplicate 合并）
- [x] ThreeCardRing.tsx import 位置修正
- [x] useCardRing inertia snap 跳过已选中位置（修复第3张牌无法选中的 bug）

## Phase 6 — 部署 + AOC 集成（待）

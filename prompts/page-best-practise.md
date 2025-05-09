# 页面设计最佳实践

本规范总结了在前端页面开发中提升用户体验、代码质量与团队协作效率的通用最佳实践，适用于新页面设计与现有页面优化，结合 AchievementsPage 等实际经验提炼。

## 1. 接口异步请求与并发
- **说明**：页面初始化时，采用异步并发请求所需数据，减少等待时间，提升加载速度。
- **适用场景**：需要同时获取多组数据（如成就、排行榜、等级等）。

## 2. 空状态友好提示
- **说明**：为无数据、加载失败等情况设计统一的 EmptyState 组件，提供图标、标题和描述，避免页面空白。
- **适用场景**：成就列表、排行榜、个人信息等模块无数据时。

## 3. 类型安全
- **说明**：所有接口返回值、组件 props、状态管理均采用 TypeScript 类型声明，确保数据流转安全，减少运行时错误。
- **适用场景**：接口调用、组件开发、状态管理。

## 4. 统一组件复用
- **说明**：常用元素（如按钮、进度条、空状态等）封装为统一风格组件，便于维护和风格统一。
- **适用场景**：全站通用 UI 元素、交互按钮、进度展示等。

## 5. 响应式布局
- **说明**：页面布局采用响应式设计，适配移动端和桌面端，提升多端体验。
- **适用场景**：主要页面、弹窗、卡片等。

## 6. 异常与错误处理
- **说明**：接口请求失败时，提供错误提示或重试机制，避免用户无反馈。建议后续补充全局异常捕获。
- **适用场景**：数据加载、表单提交、操作反馈等。

## 7. 清晰的数据流转
- **说明**：数据流向应清晰（接口 → useState/useReducer → 组件渲染），避免多层嵌套和重复请求。
- **适用场景**：页面初始化、数据刷新、状态同步。

## 8. 交互与视觉一致性
- **说明**：交互按钮有明显激活/禁用状态，视觉元素（如进度条、奖励）采用渐变色和图标，增强吸引力。
- **适用场景**：成就奖励、排行榜高亮、等级进度等。

## 9. 代码可维护性
- **说明**：统一命名规范、目录结构清晰、注释完善，便于团队协作和长期维护。
- **适用场景**：所有前端代码。

## 10. useEffect 的合理使用
- **说明**：在 React 组件中，使用 useEffect 管理副作用（如数据请求、事件监听、定时器等），避免副作用影响组件渲染。应明确依赖项，防止重复执行或遗漏更新。
- **适用场景**：页面初始化数据加载、响应 props/state 变化触发副作用。

## 11. 类型定义统一引入
- **说明**：所有接口返回值、组件 props、状态管理等涉及的数据类型，统一在 models.ts（或 types.ts）等文件中定义并导出，页面和组件通过 import 引入，避免类型重复和不一致。
- **适用场景**：接口调用、组件开发、全局状态管理。

## 12. 服务的定义与使用
- **说明**：将所有接口请求、业务逻辑封装在 service 层（如 services/achievementService.ts），页面通过调用 service 方法获取数据，实现接口调用的集中管理和复用，便于维护和测试。

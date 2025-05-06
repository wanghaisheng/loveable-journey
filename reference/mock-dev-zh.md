# ✅ React + Mock 数据 + i18n 页面设计开发阶段最佳实践

---

## 📦 技术栈前提

* 前端框架：React（推荐 Next.js / Vite + React）
* 数据接口：开发阶段采用 Mock 数据（如 MSW、Mock Service Worker、本地 mock 文件等）
* 状态缓存：React Query（或 SWR）
* 国际化：i18next + react-i18next
* UI 框架：Tailwind CSS / Shadcn UI / Chakra UI 等

---

## 🔹1. 页面初始化与异步请求（Mock 方案）

### ✅ 最佳实践

* 使用统一的 mock 数据管理方案（如 src/mocks/ 目录集中管理）。
* 通过自定义 hooks（如 useMockQuery）模拟接口请求，接口结构与后续 tRPC 保持一致。
* 所有 `loading`, `error`, `empty` 状态配合统一组件处理。

### 示例代码

```tsx
import { useMockQuery } from '@/mocks/useMockQuery';
const { data, isLoading, isError, refetch } = useMockQuery('achievement.list');

if (isLoading) return <LoadingSpinner />;
if (isError) return <ErrorState retry={refetch} />;
if (!data.length) return <EmptyState title={t('achievement.emptyTitle')} />;
```

---

## 🔹2. Mock 数据管理与接口模拟

### ✅ 最佳实践

* 所有 mock 数据集中存放于 `/src/mocks` 目录，按模块拆分。
* mock 数据结构、字段、类型与后续 tRPC 返回保持一致，便于迁移。
* 推荐使用 TypeScript 类型定义，保证 mock 数据与真实接口类型一致。
* 可使用 MSW（Mock Service Worker）拦截请求，或直接本地模拟。

### 示例结构

```ts
// src/mocks/achievement.ts
import type { Achievement } from '@/types';
export const achievementListMock: Achievement[] = [
  { id: 1, title: 'First Step', level: 1 },
  { id: 2, title: 'Explorer', level: 2 },
];
```

```ts
// src/mocks/useMockQuery.ts
import { useState, useEffect } from 'react';
export function useMockQuery(key: string) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        // 根据 key 返回对应 mock 数据
        if (key === 'achievement.list') {
          setData(require('./achievement').achievementListMock);
        }
        setIsLoading(false);
      } catch {
        setIsError(true);
        setIsLoading(false);
      }
    }, 500);
  }, [key]);
  return { data: data || [], isLoading, isError, refetch: () => {} };
}
```

---

## 🔹3. 类型安全 & 数据流清晰

### ✅ 最佳实践

* 所有 mock 数据、hooks 返回值均使用 TypeScript 类型定义。
* 类型定义集中管理于 `/types` 目录，后续迁移 tRPC 时可直接复用。
* 组件 props 必须显式定义类型。

### 示例

```ts
// src/types/index.ts
export type Achievement = {
  id: number;
  title: string;
  level: number;
};
```

---

## 🔹4. 服务逻辑抽象与迁移便利性

### ✅ 最佳实践

* 所有数据请求通过自定义 hooks（如 useMockQuery/useAchievementsMock）封装，避免组件内直接引用 mock 数据。
* 保持 hooks 的参数、返回结构与 tRPC hooks 一致，后续切换只需替换实现。
* 迁移到 tRPC 时，仅需将 useMockQuery 替换为 trpc.xxx.useQuery。

### 示例

```ts
// hooks/useAchievementsMock.ts
import { useMockQuery } from '@/mocks/useMockQuery';
export const useAchievementsMock = () => useMockQuery('achievement.list');
```

---

## 🔹5. 组件复用与空状态处理

### ✅ 最佳实践

* 常用组件（按钮、空状态、错误提示、进度条）封装在 `/components/ui` 或 `/components/common`。
* 支持国际化参数传入。

### 示例

```tsx
<EmptyState
  title={t('achievement.emptyTitle')}
  description={t('achievement.emptyDesc')}
/>
```

---

## 🔹6. 响应式布局与适配

### ✅ 最佳实践

* 全站统一使用响应式框架（Tailwind CSS）。
* 小屏设备优先（Mobile First），并考虑无障碍可访问性。
* 对话框、弹窗等使用库（如 Radix UI / Headless UI）。

---

## 🔹7. useEffect 合理使用

### ✅ 最佳实践

* 避免用 `useEffect` 手动拉取数据，优先使用自定义 mock hooks。
* 副作用如监听、定时器、动画控制等，才使用 `useEffect`。
* 严格定义依赖项，避免无限循环。

---

## 🔹8. 国际化辅助函数封装

### ✅ 最佳实践

* 对于带动态插值（如奖励数量、等级、日期），使用 t 的占位符。
* 可封装 `useI18nHelper` 工具简化常用操作。

### 示例

```ts
t('achievement.level', { level: 3 }); // => Level 3
```

---

## 🔹9. 错误与异常处理

### ✅ 最佳实践

* mock hooks 支持 isError 状态，并可模拟错误场景。
* 提供 Retry 功能，避免用户卡住。
* 全局错误捕捉（如 `react-error-boundary`）用于不可控异常。

---

## 🔹10. 项目结构推荐（建议）

```
src/
├── components/
│   ├── ui/
│   └── common/
├── pages/
│   └── achievement/
├── hooks/
│   └── useAchievementsMock.ts
├── mocks/
│   ├── achievement.ts
│   └── useMockQuery.ts
├── i18n/
│   ├── config.ts
│   └── locales/
├── types/
```

---

## 🔹11. 动效与视觉统一

### ✅ 最佳实践

* 鼓励使用渐变色、动画（如 `Framer Motion`）强化视觉体验。
* 所有交互按钮提供明显 hover、active、disabled 状态。

---

## 🔹12. 维护性与可协作性

### ✅ 最佳实践

* 所有类型、常量、枚举集中管理在 `/types`。
* 所有 key（如成就类型）统一使用常量定义。
* mock 数据与真实接口字段保持一致，便于团队协作和后续迁移。

---

## ✅ 总结（适用于 AchievementPage 等场景）

| 模块      | 实践方向                             |
| ------- | -------------------------------- |
| 数据请求    | useMockQuery / useMutationMock      |
| 状态处理    | isLoading / isError / EmptyState |
| 类型管理    | TypeScript 类型 / 明确 props         |
| 国际化支持   | useTranslation + namespace 拆分    |
| UI组件复用  | Loading、Empty、Error、Button 等     |
| 多语言文案管理 | t('xxx.key') + 插值                |
| 可维护结构   | mocks / hooks / components / types 分离    |

---

### 🚀 迁移到 tRPC 的建议

1. 保持 mock hooks 与 tRPC hooks 参数、返回结构一致。
2. 类型定义集中管理，mock 数据与接口类型同步。
3. 迁移时仅需将 useMockQuery 替换为 trpc.xxx.useQuery，业务代码无需大改。
4. mock 数据可作为后续接口联调的参考和测试用例。

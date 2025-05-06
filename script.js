document.addEventListener('DOMContentLoaded', function() {
    // Additional tips data
    const additionalTips = [
        "Break complex requirements into smaller, focused prompts to get more precise results from Loveable.dev.",
        "When describing UI components, be specific about interactions and state changes to reduce the need for revisions.",
        "Include example code snippets in your requirements when you want Loveable to follow specific patterns or conventions.",
        "For complex data visualization requirements, create simple diagrams or mockups to supplement your text descriptions.",
        "Track which prompts consume more credits and optimize them for efficiency in future projects.",
        "When possible, use progressive enhancement - start with a basic version and iterate with more specific requirements.",
        "Maintain a 'prompt library' of effective instructions that produced good results for reuse in similar projects.",
        "Consider time of day for your Loveable sessions - sometimes the system performs better during off-peak hours."
    ];

    // Modal functionality
    const modal = document.getElementById("tipModal");
    const btn = document.getElementById("showTipsBtn");
    const span = document.getElementsByClassName("close")[0];
    const tipsList = document.getElementById("tipsList");

    // Show modal when button is clicked
    btn.onclick = function() {
        // Populate tips list
        tipsList.innerHTML = '';
        additionalTips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });
        
        modal.style.display = "block";
    }

    // Close modal when X is clicked
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Intersection Observer for card animations
    const cards = document.querySelectorAll('.strategy-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Add metadata for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        const meta = document.createElement('meta');
        meta.name = "description";
        meta.content = "Learn the most effective strategies for using Loveable.dev from someone who spent 100 credits in just 3 days. Discover how to maximize AI-assisted development.";
        document.head.appendChild(meta);
    }

    // Prompt content
    const reactI18nPrompt = `# ✅ React + Mock 数据 + i18n 页面设计开发阶段最佳实践

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
* 所有 \`loading\`, \`error\`, \`empty\` 状态配合统一组件处理。

### 示例代码

\`\`\`tsx
import { useMockQuery } from '@/mocks/useMockQuery';
const { data, isLoading, isError, refetch } = useMockQuery('achievement.list');

if (isLoading) return <LoadingSpinner />;
if (isError) return <ErrorState retry={refetch} />;
if (!data.length) return <EmptyState title={t('achievement.emptyTitle')} />;
\`\`\`

---

## 🔹2. Mock 数据管理与接口模拟

### ✅ 最佳实践

* 所有 mock 数据集中存放于 \`/src/mocks\` 目录，按模块拆分。
* mock 数据结构、字段、类型与后续 tRPC 返回保持一致，便于迁移。
* 推荐使用 TypeScript 类型定义，保证 mock 数据与真实接口类型一致。
* 可使用 MSW（Mock Service Worker）拦截请求，或直接本地模拟。

### 示例结构

\`\`\`ts
// src/mocks/achievement.ts
import type { Achievement } from '@/types';
export const achievementListMock: Achievement[] = [
  { id: 1, title: 'First Step', level: 1 },
  { id: 2, title: 'Explorer', level: 2 },
];
\`\`\`

\`\`\`ts
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
\`\`\`

---

## 🔹3. 类型安全 & 数据流清晰

### ✅ 最佳实践

* 所有 mock 数据、hooks 返回值均使用 TypeScript 类型定义。
* 类型定义集中管理于 \`/types\` 目录，后续迁移 tRPC 时可直接复用。
* 组件 props 必须显式定义类型。

### 示例

\`\`\`ts
// src/types/index.ts
export type Achievement = {
  id: number;
  title: string;
  level: number;
};
\`\`\`

---

## 🔹4. 服务逻辑抽象与迁移便利性

### ✅ 最佳实践

* 所有数据请求通过自定义 hooks（如 useMockQuery/useAchievementsMock）封装，避免组件内直接引用 mock 数据。
* 保持 hooks 的参数、返回结构与 tRPC hooks 一致，后续切换只需替换实现。
* 迁移到 tRPC 时，仅需将 useMockQuery 替换为 trpc.xxx.useQuery。

### 示例

\`\`\`ts
// hooks/useAchievementsMock.ts
import { useMockQuery } from '@/mocks/useMockQuery';
export const useAchievementsMock = () => useMockQuery('achievement.list');
\`\`\`

---

## 🔹5. 组件复用与空状态处理

### ✅ 最佳实践

* 常用组件（按钮、空状态、错误提示、进度条）封装在 \`/components/ui\` 或 \`/components/common\`。
* 支持国际化参数传入。

### 示例

\`\`\`tsx
<EmptyState
  title={t('achievement.emptyTitle')}
  description={t('achievement.emptyDesc')}
/>
\`\`\`

---

## 🔹6. 响应式布局与适配

### ✅ 最佳实践

* 全站统一使用响应式框架（Tailwind CSS）。
* 小屏设备优先（Mobile First），并考虑无障碍可访问性。
* 对话框、弹窗等使用库（如 Radix UI / Headless UI）。

---

## 🔹7. useEffect 合理使用

### ✅ 最佳实践

* 避免用 \`useEffect\` 手动拉取数据，优先使用自定义 mock hooks。
* 副作用如监听、定时器、动画控制等，才使用 \`useEffect\`。
* 严格定义依赖项，避免无限循环。

---

## 🔹8. 国际化辅助函数封装

### ✅ 最佳实践

* 对于带动态插值（如奖励数量、等级、日期），使用 t 的占位符。
* 可封装 \`useI18nHelper\` 工具简化常用操作。

### 示例

\`\`\`ts
t('achievement.level', { level: 3 }); // => Level 3
\`\`\`

---

## 🔹9. 错误与异常处理

### ✅ 最佳实践

* mock hooks 支持 isError 状态，并可模拟错误场景。
* 提供 Retry 功能，避免用户卡住。
* 全局错误捕捉（如 \`react-error-boundary\`）用于不可控异常。

---

## 🔹10. 项目结构推荐（建议）

\`\`\`
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
\`\`\`

---

## 🔹11. 动效与视觉统一

### ✅ 最佳实践

* 鼓励使用渐变色、动画（如 \`Framer Motion\`）强化视觉体验。
* 所有交互按钮提供明显 hover、active、disabled 状态。

---

## 🔹12. 维护性与可协作性

### ✅ 最佳实践

* 所有类型、常量、枚举集中管理在 \`/types\`。
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
4. mock 数据可作为后续接口联调的参考和测试用例。`;

    const dataLayoutPrompt = `# 页面设计最佳实践

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
- **说明**：将所有接口请求、业务逻辑封装在 service 层（如 services/achievementService.ts），页面通过调用 service 方法获取数据，实现接口调用的集中管理和复用，便于维护和测试。`;

    // Populate prompt content
    document.getElementById('react-i18n').textContent = reactI18nPrompt;
    document.getElementById('data-layout').textContent = dataLayoutPrompt;
    
    // Initialize preview content (first 100 characters)
    /* @tweakable number of characters to show in preview */
    const previewLength = 100;
    
    // Update existing preview
    document.querySelector('.prompt-preview').textContent = 
        reactI18nPrompt.substring(0, previewLength) + '...';
    
    // Add new preview
    const previewElements = document.querySelectorAll('.prompt-preview');
    if (previewElements.length > 1) {
        previewElements[1].textContent = 
            dataLayoutPrompt.substring(0, previewLength) + '...';
    }
    
    // Handle expand button clicks
    const expandButtons = document.querySelectorAll('.expand-btn');
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.parentElement;
            const content = card.querySelector('.prompt-content');
            
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                this.textContent = 'View Full Prompt';
            } else {
                content.classList.add('expanded');
                this.textContent = 'Hide Full Prompt';
            }
        });
    });
    
    // Handle copy button clicks
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const promptId = this.getAttribute('data-prompt-id');
            const textToCopy = document.getElementById(promptId).textContent;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const icon = this.querySelector('i');
                icon.classList.remove('fa-copy');
                icon.classList.add('fa-check');
                icon.classList.add('copy-success');
                
                setTimeout(() => {
                    icon.classList.remove('fa-check');
                    icon.classList.remove('copy-success');
                    icon.classList.add('fa-copy');
                }, 2000);
            });
        });
    });
    
    // Handle View All Prompts button
    const viewAllBtn = document.getElementById('viewAllPromptsBtn');
    viewAllBtn.addEventListener('click', function() {
        const allPromptCards = document.querySelectorAll('.prompt-card');
        const allPromptContents = document.querySelectorAll('.prompt-content');
        const allExpandBtns = document.querySelectorAll('.expand-btn');
        
        if (this.textContent === 'View All Prompts') {
            allPromptContents.forEach(content => {
                content.classList.add('expanded');
            });
            allExpandBtns.forEach(btn => {
                btn.textContent = 'Hide Full Prompt';
            });
            this.textContent = 'Collapse All Prompts';
        } else {
            allPromptContents.forEach(content => {
                content.classList.remove('expanded');
            });
            allExpandBtns.forEach(btn => {
                btn.textContent = 'View Full Prompt';
            });
            this.textContent = 'View All Prompts';
        }
    });

    /* @tweakable footer link animation duration in milliseconds */
    const footerLinkAnimationDuration = 300;
    
    // Add hover effect to footer GitHub link
    const footerLink = document.querySelector('.footer-link');
    if (footerLink) {
        footerLink.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.github-icon');
            icon.style.transition = `transform ${footerLinkAnimationDuration}ms ease`;
            icon.style.transform = 'rotate(360deg) scale(1.2)';
        });
        
        footerLink.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.github-icon');
            icon.style.transform = 'rotate(0) scale(1)';
        });
    }
});
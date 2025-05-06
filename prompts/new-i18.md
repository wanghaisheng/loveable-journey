# 多语言实现方案

## 整体架构

我们采用了一种基于 hooks 和类型安全的多语言实现方案，主要包含以下几个部分：

1. **数据层 (Data Layer)**
   - 位置：`src/data/{lang}/`
   - 每个语言一个目录，如 `zh/`、`en/` 等
   - 每个页面/功能模块一个独立的数据文件
   - 使用 TypeScript 接口确保类型安全

2. **Hook 层 (Hook Layer)**
   - 位置：`src/hooks/`
   - 每个数据模块对应一个 hook
   - 通过 `useMockQuery` 统一管理数据获取
   - 自动处理语言切换

3. **页面层 (Page Layer)**
   - 位置：`src/pages/`
   - 使用对应的 hook 获取数据
   - 专注于展示逻辑，不直接处理翻译

## 数据文件结构

以 `benefits.ts` 为例：

```typescript
interface BenefitsData {
  pageData: {
    title: string;
    description: string;
    // ... 其他页面文本
  };
  items: Array<{
    id: number;
    name: string;
    // ... 其他数据字段
  }>;
  benefits: Array<{
    icon: LucideIcon;
    title: string;
    description: string;
  }>;
}
```

## Hook 实现

以 `useBenefitsData` 为例：

```typescript
export const useBenefitsData = () => {
  const { i18n } = useTranslation();
  return useMockQuery('benefits', i18n.language);
};
```

## 页面使用示例

```typescript
const Benefits = () => {
  const { data: benefits, isLoading, isError } = useBenefitsData();
  const { pageData, items: benefitsList } = benefits || {};

  // 使用数据
  return (
    <Layout>
      <h1>{pageData?.title}</h1>
      <p>{pageData?.description}</p>
      {/* ... 其他内容 */}
    </Layout>
  );
};
```

## 优势

1. **类型安全**
   - 使用 TypeScript 接口确保数据结构的一致性
   - 在开发时就能发现潜在的类型错误

2. **关注点分离**
   - 数据层：管理多语言内容
   - Hook 层：处理数据获取和语言切换
   - 页面层：专注于 UI 展示

3. **易于维护**
   - 每个语言独立文件，便于管理
   - 统一的数据结构，便于扩展
   - 清晰的职责划分

4. **性能优化**
   - 按需加载语言数据
   - 避免不必要的重渲染

## 最佳实践

1. **数据组织**
   - 将页面文本和动态数据分开管理
   - 使用有意义的字段名
   - 保持数据结构的一致性

2. **类型定义**
   - 为每个数据模块定义清晰的接口
   - 使用 TypeScript 的类型检查功能
   - 避免使用 `any` 类型

3. **错误处理**
   - 处理加载状态
   - 处理错误状态
   - 提供合适的回退内容

4. **代码组织**
   - 遵循项目既定的目录结构
   - 保持文件命名的一致性
   - 适当添加注释说明

## 注意事项

1. 确保所有文本都通过数据文件管理，避免硬编码
2. 保持各语言版本的数据结构一致
3. 注意处理数据加载和错误状态
4. 考虑添加语言回退机制
5. 定期检查未翻译的文本

## 后续优化方向

1. 添加语言切换动画
2. 实现语言包按需加载
3. 添加翻译进度追踪
4. 集成翻译管理工具
5. 添加自动化测试 

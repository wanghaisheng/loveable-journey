Okay, let's craft a complete, independent example demonstrating type-safety best practices for your API-driven internationalization setup with React Query.

This example will emphasize:

1.  **Strong Typing Everywhere**: Using TypeScript effectively for all data structures, props, context, and API responses.
2.  **Clear API Contracts**: Defining interfaces for what your API endpoints expect and return.
3.  **Custom Hook with Generics**: `useInternationalizedQuery` will be robustly typed.
4.  **Context Safety**: Ensuring `useLanguage` is used correctly.
5.  **Error Handling with Types**: Basic error type handling.
6.  **Path Aliases**: For cleaner imports (`@/*`).
7.  **Strict Mode in `tsconfig.json`**.
8.  **Comprehensive README** explaining the type-safety aspects.

---

**Project Setup (Recommended):**

It's best to create a new project for this:

```bash
npm create vite@latest react-query-typesafe-i18n -- --template react-ts
cd react-query-typesafe-i18n
npm install @tanstack/react-query
# Optional: npm install -D @types/node # For path alias setup if needed
```

---

**File Structure:**

```
react-query-typesafe-i18n/
├── README.md
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css           # Basic global styles
    ├── vite-env.d.ts       # Vite's type declarations
    ├── types/
    │   └── index.ts        # Centralized type definitions
    ├── context/
    │   └── LanguageProvider.tsx
    ├── api/
    │   ├── getGlobalUILabels.ts
    │   └── getMoodHistory.ts
    ├── hooks/
    │   └── useInternationalizedQuery.ts
    └── components/
        └── MoodHistoryComponent.tsx
```

---

**1. `README.md`**

```markdown
# React Query & Type-Safe API-Driven Internationalization Demo

This project demonstrates best practices for building a type-safe internationalization (i18n) system using React, TypeScript, React Query, and an API-first approach for all translatable content.

## Core Principles & Type-Safety Highlights:

1.  **Centralized Type Definitions (`src/types/index.ts`):**
    *   All shared data structures, API response shapes, and context types are defined in one place. This promotes consistency and makes it easier to understand the data flow.
    *   `Language` type uses a string literal union for precise language codes.

2.  **Strict TypeScript Configuration (`tsconfig.json`):**
    *   `"strict": true` is enabled, enforcing a higher level of type checking (includes `strictNullChecks`, `noImplicitAny`, etc.).
    *   Path aliases (`@/*`) are configured for cleaner and more maintainable import paths.

3.  **Typed API Contracts:**
    *   Each API function (`getGlobalUILabels`, `getMoodHistory`) has explicit `Promise` return types (`Promise<FullGlobalLabelsResponse>`, `Promise<FullMoodHistoryResponse>`).
    *   The shapes of API responses (`FullGlobalLabelsResponse`, `FullMoodHistoryResponse`) clearly define the expected `labels` and `data` structures, ensuring that what the API mock returns matches what the application expects.

4.  **Type-Safe Language Context (`src/context/LanguageProvider.tsx`):**
    *   `LanguageContextType` defines the shape of the context value.
    *   `useLanguage` custom hook includes a runtime check to ensure it's used within a `LanguageProvider`, throwing an error if not, preventing runtime issues with `undefined` context.
    *   The `t` function in the context is now a simple passthrough, reinforcing that all primary translations come from the API.

5.  **Generic and Type-Safe Custom Hook (`src/hooks/useInternationalizedQuery.ts`):**
    *   `useInternationalizedQuery` is heavily generic:
        *   `TQueryFnResult`: The full shape returned by the `queryFn` (e.g., `{ labels: ..., data: ... }`).
        *   `TError`: The error type.
        *   `TData`: Inferred type of the `data` property from `TQueryFnResult`.
        *   `TLabels`: Inferred type of the `labels` property from `TQueryFnResult`.
        *   `TQueryKey`: The type for React Query's query key.
    *   This allows the hook to correctly infer and return typed `data` and `labels` based on the specific API function passed to `useQuery`'s `queryFn`.
    *   It destructures the API response and provides typed access to its `labels` and `data` parts.

6.  **Type-Safe Component Usage:**
    *   Components like `AppContent` and `MoodHistoryComponent` receive typed `labels` and `data` from `useInternationalizedQuery`.
    *   TypeScript checks ensure that components are trying to access properties that actually exist on these typed objects.
    *   Optional properties in label types (e.g., `entriesListHeader?: string`) are handled safely using optional chaining (`labels?.entriesListHeader`) or by providing fallbacks.

7.  **React Query Integration:**
    *   `queryKey` includes the `language` variable. When `language` changes, React Query treats it as a new query, automatically refetching data for the new language and ensuring type consistency for that language's specific labels/data.
    *   Error types in `useQuery` are specified (e.g., `Error`).

8.  **Avoiding `any`:**
    *   The codebase strives to avoid the `any` type, opting for specific types or generics to maintain type integrity.

9.  **Clear Loading and Error States:**
    *   Components handle `isPending`, `isLoading`, `isError` states, often using fetched labels for these states if available, or sensible fallbacks.

## Running the Demo

1.  Clone the repository (or create the files as listed).
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
4.  Open your browser to the URL provided by Vite (usually `http://localhost:5173`).

This setup provides a robust foundation for building applications where language and content are dynamic and type safety is paramount, reducing runtime errors and improving developer experience.
```

---

**2. `package.json`** (Same as previous example, ensure `@tanstack/react-query` is present)

```json
{
  "name": "react-query-typesafe-i18n",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.32.0", // Or your specific v5 version
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@typescript-eslint/eslint-plugin": "^7.2.0",
    "@typescript-eslint/parser": "^7.2.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  }
}
```

---

**3. `vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Import path module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Setup @/* path alias
    },
  },
})
```

---

**4. `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler", // or "node" for older setups
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting & Strictness - KEY FOR TYPE SAFETY */
    "strict": true, // Enables all strict type-checking options
    "noImplicitAny": true, // Raise error on expressions and declarations with an implied 'any' type.
    "strictNullChecks": true, // In strict null checking mode, the null and undefined values are not in the domain of every type and are only assignable to themselves and any
    "strictFunctionTypes": true, // Disable bivariant parameter checking for function types.
    "strictBindCallApply": true, // Enable stricter checking of of the bind, call, and apply methods on functions.
    "strictPropertyInitialization": true, // Ensure non-undefined class properties are initialized in the constructor.
    "noImplicitThis": true, // Raise error on 'this' expressions with an implied 'any' type.
    "alwaysStrict": true, // Parse in strict mode and emit "use strict" for each source file.
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,


    /* Path Aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src", "vite.config.ts"], // Include vite.config.ts for path alias resolving
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

**5. `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler", // or "node"
    "allowSyntheticDefaultImports": true,
    "strict": true // Also good to have strictness for build-tooling files
  },
  "include": ["vite.config.ts"]
}
```

---

**6. `src/vite-env.d.ts`** (Usually auto-generated by Vite)

```typescript
/// <reference types="vite/client" />
```

---

**7. `src/index.css`** (Same basic styles as the previous complete example)

```css
/* ... (copy from previous example's src/index.css) ... */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f4f7f6;
  color: #333;
  line-height: 1.6;
}

#root {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1, h2, h3 {
  color: #1a535c; /* Dark cyan */
}

button {
  background-color: #4ecdc4; /* Medium turquoise */
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s ease-in-out;
}

button:hover:not(:disabled) {
  background-color: #3db8af;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 20px 0;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  background-color: #f9f9f9;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 4px;
  border-left: 3px solid #4ecdc4;
}

.component-section {
  border: 1px solid #e0e0e0;
  padding: 20px;
  margin-top: 20px;
  border-radius: 6px;
  background-color: #ffffff;
}

.loading-text, .error-text {
  font-style: italic;
  padding: 10px;
  border-radius: 4px;
}

.loading-text {
  color: #555;
  background-color: #f0f0f0;
}

.error-text {
  color: #d32f2f; /* Red */
  background-color: #ffcdd2; /* Light red */
}

.error-container {
  border: 1px solid #d32f2f;
  padding: 15px;
  border-radius: 5px;
  background-color: #ffebee;
}
```

---

**8. `src/types/index.ts`**

```typescript
// src/types/index.ts

// ===== Language Context Types =====
/**
 * Supported language codes.
 */
export type Language = "en" | "zh";

/**
 * Shape of the language context provided by LanguageProvider.
 */
export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  /**
   * Basic translation function, primarily a passthrough or for very static keys.
   * All dynamic content should come from API-fetched labels.
   * @param key The translation key.
   * @param params Optional parameters for interpolation.
   * @returns The translated string or the key itself if not found.
   */
  t: (key: string, params?: Record<string, string | number>) => string;
}

// ===== API - Global UI Labels Types =====
/**
 * Labels for general application UI elements.
 */
export interface GlobalAppLabels {
  appTitle: string;
  switchToChinese: string;
  switchToEnglish: string;
  footerText: string;
  loadingAppText: string;
  appErrorHeading: string;
  appErrorGeneralMessage: string; // Renamed for clarity
  refreshingUITextIndicator?: string; // Optional loading indicator text
}

/**
 * Expected response structure from the global UI labels API endpoint.
 * The 'data' field is null as this endpoint primarily serves labels.
 */
export interface FullGlobalLabelsResponse {
  labels: GlobalAppLabels;
  data: null; // Consistent with useInternationalizedQuery structure
}

// ===== API - Mood History Specific Types =====
/**
 * Represents a single mood entry. Mood text is pre-translated by the API.
 */
export interface MoodEntry {
  readonly id: number; // IDs are typically read-only
  readonly mood: string;
  readonly date: string;
}

/**
 * Labels specific to the MoodHistory component.
 */
export interface MoodHistoryComponentLabels {
  sectionTitle: string;
  loadingMessage: string;
  noDataMessage: string;
  /** Template for error messages, e.g., "Error: {message}" */
  errorMessageTemplate: string;
  entriesListHeader?: string; // Optional header
  refreshButtonText: string;
  refreshingButtonTextIndicator?: string; // Optional text for button during refresh
  /** Template for API info, e.g., "Displaying {count} entries for {lang}" */
  apiInfoMessageTemplate?: string;
  componentInternalErrorText?: string; // Fallback if labels themselves fail to load
}

/**
 * The "data" payload for the MoodHistory component.
 */
export interface MoodHistoryComponentData {
  readonly entries: readonly MoodEntry[]; // Entries array is read-only, MoodEntry items are read-only
  readonly entryCount: number;
}

/**
 * Expected response structure from the mood history API endpoint.
 */
export interface FullMoodHistoryResponse {
  labels: MoodHistoryComponentLabels;
  data: MoodHistoryComponentData;
}

/**
 * A more specific error type that our API might return.
 * For this demo, we'll assume a simple structure.
 */
export interface ApiError extends Error {
  statusCode?: number;
  errorCode?: string;
}
```
*Added `readonly` where appropriate for immutability, clarified some names, and introduced a basic `ApiError` type (though not fully implemented in mocks for simplicity).*

---

**9. `src/context/LanguageProvider.tsx`**

```tsx
// src/context/LanguageProvider.tsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import type { Language, LanguageContextType } from "@/types"; // Using path alias

const DEFAULT_LANGUAGE: Language = "en";
const LOCAL_STORAGE_KEY = "app_language";

// Initialize context with undefined to enforce provider usage.
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const savedLanguage = localStorage.getItem(LOCAL_STORAGE_KEY) as Language | null;
      // Type guard for savedLanguage
      if (savedLanguage === "en" || savedLanguage === "zh") {
        return savedLanguage;
      }
    } catch (error) {
      // Catch potential localStorage access errors (e.g., in private browsing)
      console.warn("Could not access localStorage for language preference:", error);
    }
    return DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, language);
      document.documentElement.lang = language; // Set lang attribute for accessibility
    } catch (error) {
      console.warn("Could not save language preference to localStorage:", error);
    }
  }, [language]);

  // Use useCallback for functions passed in context value if they have dependencies
  // or if consumers might memoize based on them. Here, setLanguageState is stable.
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []); // No dependencies, setLanguageState from useState is stable

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let text = key; // Fallback to the key itself
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        const placeholder = `{{${paramKey}}}`;
        // Ensure global replacement and escape special regex characters in placeholder
        text = text.replace(
          new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          String(paramValue) // Ensure paramValue is a string for replacement
        );
      });
    }
    // console.debug(`LanguageProvider.t passthrough for key: "${key}"`);
    return text;
  }, []); // No dependencies for this simple 't'

  const contextValue = { language, setLanguage, t };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Custom hook to consume the LanguageContext.
 * Provides a runtime check to ensure it's used within a LanguageProvider.
 * @returns The LanguageContext value.
 * @throws Error if used outside of a LanguageProvider.
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider. Make sure your component is a descendant of <LanguageProvider>.');
  }
  return context;
};
```
*Added `useCallback` for context functions, improved `localStorage` key handling, and enhanced comments.*

---

**10. `src/api/getGlobalUILabels.ts`**

```typescript
// src/api/getGlobalUILabels.ts
import type { Language, GlobalAppLabels, FullGlobalLabelsResponse, ApiError } from "@/types";

/**
 * Simulates fetching global UI labels from an API.
 * @param lang The desired language.
 * @returns A Promise resolving to the full global labels response.
 * @throws ApiError on simulated failure.
 */
export async function getGlobalUILabels(lang: Language): Promise<FullGlobalLabelsResponse> {
  console.log(`API: Fetching GLOBAL UI LABELS for language: ${lang}`);
  // Simulate variable network delay
  await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 250));

  let labels: GlobalAppLabels;

  if (lang === 'zh') {
    labels = {
      appTitle: "我的类型安全应用 (API)",
      switchToEnglish: "切换到 English",
      switchToChinese: "切换到 中文",
      footerText: "类型安全的 API 驱动国际化演示",
      loadingAppText: `正在加载应用界面 (${lang.toUpperCase()})...`,
      appErrorHeading: "应用错误",
      appErrorGeneralMessage: "无法加载应用界面核心文本。",
      refreshingUITextIndicator: "(界面文本刷新中...)"
    };
  } else { // Default to 'en'
    labels = {
      appTitle: "My Type-Safe App (API)",
      switchToEnglish: "Switch to English",
      switchToChinese: "Switch to 中文",
      footerText: "Type-Safe API-Driven Internationalization Demo",
      loadingAppText: `Loading application interface (${lang.toUpperCase()})...`,
      appErrorHeading: "Application Error",
      appErrorGeneralMessage: "Could not load essential UI text.",
      refreshingUITextIndicator: "(Refreshing UI text...)"
    };
  }

  // Simulate a rare API error
  if (Math.random() < 0.03) { // 3% chance of error
    console.error("API_ERROR: Simulating failure for getGlobalUILabels");
    const error: ApiError = new Error(
      lang === 'zh' ? "全局标签服务暂时出现故障。" : "Global labels service temporarily failed."
    ) as ApiError; // Type assertion example (use with caution)
    error.statusCode = 503;
    error.errorCode = "GLOBAL_LABELS_UNAVAILABLE";
    throw error;
  }

  return { labels, data: null }; // data is null as per FullGlobalLabelsResponse type
}
```
*Added JSDoc, more specific error simulation with `ApiError`.*

---

**11. `src/api/getMoodHistory.ts`**

```typescript
// src/api/getMoodHistory.ts
import type {
  Language,
  FullMoodHistoryResponse,
  MoodEntry,
  MoodHistoryComponentData,
  MoodHistoryComponentLabels,
  ApiError
} from "@/types";

// Helper to get pre-translated mood text.
// In a real app, this logic might be on the backend or a more complex i18n library.
const getMoodText = (moodKey: 'happy' | 'calm' | 'excited' | 'thoughtful', lang: Language): string => {
  const moods = {
    happy: { en: 'Joyful', zh: '开心' }, // Changed 'Happy' to 'Joyful' for demo
    calm: { en: 'Serene', zh: '平静' }, // Changed 'Calm' to 'Serene'
    excited: { en: 'Thrilled', zh: '兴奋' }, // Changed 'Excited' to 'Thrilled'
    thoughtful: { en: 'Pondering', zh: '沉思' }, // Changed 'Thoughtful' to 'Pondering'
  };
  // Fallback to English if the specific language or moodKey is not found
  return moods[moodKey]?.[lang] || moods[moodKey]?.['en'] || moodKey.toString();
};

/**
 * Simulates fetching mood history data and associated labels from an API.
 * @param lang The desired language.
 * @returns A Promise resolving to the full mood history response.
 * @throws ApiError on simulated failure.
 */
export async function getMoodHistory(lang: Language): Promise<FullMoodHistoryResponse> {
  console.log(`API: Fetching MOOD HISTORY (data & labels) for language: ${lang}`);
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));

  let labels: MoodHistoryComponentLabels;
  let data: MoodHistoryComponentData;

  // Using `as const` ensures `moodKey` is a literal type, not just `string`.
  const baseEntriesRaw = [
    { id: 1, moodKey: 'happy', date: "2024-07-10" },
    { id: 2, moodKey: 'calm', date: "2024-07-09" },
  ] as const;

  // Type-safe mapping due to `as const` on baseEntriesRaw
  const translatedEntries: MoodEntry[] = baseEntriesRaw.map(entry => ({
    id: entry.id,
    mood: getMoodText(entry.moodKey, lang), // moodKey is now correctly typed
    date: entry.date,
  }));

  if (lang === 'zh') {
    labels = {
      sectionTitle: "我的心情日记 (API 提供)",
      loadingMessage: "正在努力加载您的心情...",
      noDataMessage: "空空如也，快来记录今日心情吧！",
      errorMessageTemplate: "加载心情数据时发生错误: {message}",
      entriesListHeader: "心情列表:",
      refreshButtonText: "点我刷新",
      refreshingButtonTextIndicator: "刷新中，请稍候...",
      apiInfoMessageTemplate: "当前显示语言 {lang} 的 {count} 条心情记录。",
      componentInternalErrorText: "心情日记组件界面文本加载失败，请稍后再试。"
    };
    // Simulate data presence
    const shouldHaveData = Math.random() > 0.1; // 90% chance of having data
    data = {
      entries: shouldHaveData ? translatedEntries : [],
      entryCount: shouldHaveData ? translatedEntries.length : 0,
    };
  } else { // Default to 'en'
    const moreEntriesRaw = [
      ...baseEntriesRaw,
      { id: 3, moodKey: 'excited', date: "2024-07-08" },
      { id: 4, moodKey: 'thoughtful', date: "2024-07-07" },
    ] as const;

    const translatedMoreEntries: MoodEntry[] = moreEntriesRaw.map(entry => ({
      id: entry.id,
      mood: getMoodText(entry.moodKey, lang),
      date: entry.date,
    }));

    labels = {
      sectionTitle: "My Mood Journal (API Provided)",
      loadingMessage: "Loading your awesome moods...",
      noDataMessage: "No moods recorded yet. Let's add one!",
      errorMessageTemplate: "Oops! Error fetching mood data: {message}",
      entriesListHeader: "Mood Entries:",
      refreshButtonText: "Refresh Moods",
      refreshingButtonTextIndicator: "Refreshing, one moment...",
      apiInfoMessageTemplate: "Displaying {count} mood entries for language {lang}.",
      componentInternalErrorText: "Mood Journal UI text failed to load. Please try again."
    };
    const shouldHaveData = Math.random() > 0.1;
    data = {
      entries: shouldHaveData ? translatedMoreEntries : [],
      entryCount: shouldHaveData ? translatedMoreEntries.length : 0,
    };
  }

  // Simulate a rare API error
  if (Math.random() < 0.05) { // 5% chance of error
    console.error("API_ERROR: Simulating failure for getMoodHistory");
    const error: ApiError = new Error(
      lang === 'zh' ? "心情记录服务暂时不可用，请稍后重试。" : "Mood history service is temporarily unavailable. Please try again later."
    ) as ApiError;
    error.statusCode = 500;
    error.errorCode = "MOOD_SERVICE_DOWN";
    throw error;
  }

  return { labels, data };
}
```
*Used `as const` for raw entries to improve type inference for `moodKey`. More descriptive mock labels.*

---

**12. `src/hooks/useInternationalizedQuery.ts`**

```typescript
// src/hooks/useInternationalizedQuery.ts
import {
  useQuery,
  type UseQueryOptions,
  type QueryKey,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { ApiError } from '@/types'; // Using our custom ApiError type

/**
 * The structure expected from the `queryFn` when using this hook.
 * It must return an object containing `labels` and `data`.
 */
interface InternationalizedQueryFnResult<TData, TLabels> {
  labels: TLabels;
  data: TData;
}

/**
 * The refined result type provided by the `useInternationalizedQuery` hook.
 * It separates `labels` and `data` and includes standard React Query status fields.
 */
interface UseInternationalizedQueryResult<TData, TLabels, TErrorResponse> {
  data: TData | undefined;
  labels: TLabels | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: TErrorResponse | null; // Typed error
  refetch: UseQueryResult<InternationalizedQueryFnResult<TData, TLabels>, TErrorResponse>['refetch'];
  status: UseQueryResult<InternationalizedQueryFnResult<TData, TLabels>, TErrorResponse>['status'];
  isSuccess: boolean;
  isPending: boolean; // From TanStack Query v5
}

/**
 * A custom React Query hook designed for API endpoints that return both
 * internationalized labels and primary data in a single response.
 *
 * @template TQueryFnResult The complete type returned by the `queryFn` (must extend `InternationalizedQueryFnResult`).
 * @template TErrorResponse The type of error object expected from the API or React Query. Defaults to `ApiError`.
 * @template TData The type of the 'data' part of `TQueryFnResult`. Inferred by default.
 * @template TLabels The type of the 'labels' part of `TQueryFnResult`. Inferred by default.
 * @template TQueryKey The type of the query key. Defaults to `QueryKey`.
 *
 * @param options Standard React Query options, where `queryFn` is expected
 *                to return `Promise<TQueryFnResult>`.
 * @returns An object containing typed `labels`, `data`, and React Query status indicators.
 */
export function useInternationalizedQuery<
  // TQueryFnResult is the { labels, data } object from the API
  TQueryFnResult extends InternationalizedQueryFnResult<TData, TLabels>,
  TErrorResponse extends Error = ApiError, // Using ApiError as the default error type
  TData = TQueryFnResult['data'], // Inferred data type
  TLabels = TQueryFnResult['labels'], // Inferred labels type
  TQueryKey extends QueryKey = QueryKey // Query key type
>(
  options: UseQueryOptions<TQueryFnResult, TErrorResponse, TQueryFnResult, TQueryKey>
): UseInternationalizedQueryResult<TData, TLabels, TErrorResponse> {
  const {
    data: queryResult, // This is the full { labels, data } object
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    status,
    isSuccess,
    isPending,
  } = useQuery<TQueryFnResult, TErrorResponse, TQueryFnResult, TQueryKey>(options);

  return {
    data: queryResult?.data,
    labels: queryResult?.labels,
    isLoading,
    isFetching,
    isError,
    error, // error is now typed as TErrorResponse | null
    refetch,
    status,
    isSuccess,
    isPending,
  };
}
```
*Improved JSDoc, explicitly using `ApiError` as the default error type generic.*

---

**13. `src/components/MoodHistoryComponent.tsx`**

```tsx
// src/components/MoodHistoryComponent.tsx
import React from 'react';
import { useLanguage } from '@/context/LanguageProvider';
import { getMoodHistory } from '@/api/getMoodHistory';
import { useInternationalizedQuery } from '@/hooks/useInternationalizedQuery';
import type {
  FullMoodHistoryResponse,
  MoodHistoryComponentData,
  MoodHistoryComponentLabels,
  Language,
  ApiError // Import ApiError for error typing
} from '@/types';

const MoodHistoryComponent: React.FC = () => {
  const { language } = useLanguage();

  const {
    data: moodData,
    labels,
    isPending,
    isLoading, // isLoading is true if fetching for the first time without data
    isFetching, // isFetching is true for any fetch (initial, background)
    isError,
    error, // Now typed as ApiError | null
    refetch,
  } = useInternationalizedQuery<
    FullMoodHistoryResponse,
    ApiError, // Specify ApiError as the error type
    MoodHistoryComponentData,
    MoodHistoryComponentLabels
  >({
    queryKey: ['mood-history', language], // React Query key, language triggers refetch
    queryFn: () => getMoodHistory(language as Language), // API call
    enabled: !!language, // Only run query if language is available
    staleTime: 1000 * 60 * 1, // Data considered fresh for 1 minute
    // gcTime: 1000 * 60 * 5, // How long data stays in cache after unmount (defaults to 5 mins)
  });

  // State 1: Initial pending state (no data, no labels yet)
  if (isPending) {
    return <p className="loading-text">{labels?.loadingMessage || `Loading Mood History for ${language.toUpperCase()}...`}</p>;
  }

  // State 2: Labels failed to load (critical for UI rendering)
  // This check is important if the API might successfully return data but fail on labels,
  // or if the hook structure expects labels.
  if (!labels) {
    return <p className="error-text">{labels?.componentInternalErrorText || "Mood component UI text is unavailable."}</p>;
  }

  // State 3: Data fetching error
  if (isError) {
    // Accessing specific properties from ApiError if needed
    const errorMessage = error?.message || "An unknown error occurred.";
    const errorCodeMessage = error?.errorCode ? ` (Code: ${error.errorCode})` : "";
    return (
      <div className="error-container">
        <p className="error-text">
          {labels.errorMessageTemplate.replace('{message}', errorMessage)}
          {errorCodeMessage}
        </p>
        <button onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? (labels.refreshingButtonTextIndicator || "Retrying...") : (labels.refreshButtonText || "Try Again")}
        </button>
      </div>
    );
  }

  // State 4: Data loaded successfully (labels are guaranteed by check above)
  const apiInfoMessage = labels.apiInfoMessageTemplate && moodData
    ? labels.apiInfoMessageTemplate
        .replace('{count}', String(moodData.entryCount || 0))
        .replace('{lang}', language.toUpperCase())
    : `Fetched for ${language.toUpperCase()}`;

  return (
    <div className="component-section" style={{ opacity: isFetching && !isLoading ? 0.7 : 1 }}>
      <h2>{labels.sectionTitle}</h2>
      {isFetching && !isPending && <p style={{ fontStyle: 'italic', color: 'gray' }}>Refreshing mood data...</p>}
      <p><em>{apiInfoMessage}</em></p>

      {!moodData || moodData.entries.length === 0 ? (
        <p>{labels.noDataMessage}</p>
      ) : (
        <>
          {labels.entriesListHeader && <h3>{labels.entriesListHeader}</h3>}
          <ul>
            {moodData.entries.map((entry) => (
              <li key={entry.id}>
                ID: {entry.id}, Mood: <strong>{entry.mood}</strong>, Date: {entry.date}
              </li>
            ))}
          </ul>
        </>
      )}
      <button onClick={() => refetch()} disabled={isFetching} style={{ marginTop: '10px' }}>
        {isFetching ? (labels.refreshingButtonTextIndicator || "Loading...") : labels.refreshButtonText}
      </button>
    </div>
  );
};

export default MoodHistoryComponent;
```
*Explicitly typed as `React.FC`, specified `ApiError` for the hook, improved error message display.*

---

**14. `src/App.tsx`**

```tsx
// src/App.tsx
import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Optional for debugging
import { LanguageProvider, useLanguage } from '@/context/LanguageProvider';
import MoodHistoryComponent from '@/components/MoodHistoryComponent';
import { useInternationalizedQuery } from '@/hooks/useInternationalizedQuery';
import { getGlobalUILabels } from '@/api/getGlobalUILabels';
import type {
  Language,
  FullGlobalLabelsResponse,
  GlobalAppLabels,
  ApiError, // Import ApiError
} from '@/types';

// Create a QueryClient instance with default options
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Log all query errors globally
      console.error(
        `Global Query Cache Error for key "${String(query.queryKey)}":`,
        error
      );
      // Here you could implement global error notifications (e.g., toasts)
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      console.error(
        `Global Mutation Cache Error (key: ${String(mutation.options.mutationKey)}):`,
        error
      );
    }
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx client errors, but retry others up to 2 times
        const typedError = error as ApiError; // Type assertion
        if (typedError.statusCode && typedError.statusCode >= 400 && typedError.statusCode < 500) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 1000 * 60 * 2, // Data considered fresh for 2 minutes globally
      refetchOnWindowFocus: import.meta.env.PROD, // Only refetch on window focus in production
    },
  },
});

const AppContent: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const {
    labels: globalLabels,
    isPending: isPendingGlobalLabels,
    isFetching: isFetchingGlobalLabels,
    isError: isErrorGlobalLabels,
    error: errorGlobalLabels, // Typed as ApiError | null
  } = useInternationalizedQuery<
    FullGlobalLabelsResponse,
    ApiError, // Specify ApiError as the error type
    null,     // Data part is null for this query
    GlobalAppLabels
  >({
    queryKey: ['global-ui-labels', language],
    queryFn: () => getGlobalUILabels(language), // API call
    enabled: !!language, // Only run if language is set
    // staleTime can be overridden here for specific queries
  });

  const handleToggleLanguage = () => {
    const nextLanguage: Language = language === 'en' ? 'zh' : 'en';
    setLanguage(nextLanguage);
  };

  // Initial loading state for the entire app's UI text
  if (isPendingGlobalLabels && !globalLabels) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p className="loading-text">
          {globalLabels?.loadingAppText || `Loading Application (${language.toUpperCase()})...`}
        </p>
      </div>
    );
  }

  // Critical error if global labels fail to load
  if (isErrorGlobalLabels || !globalLabels) {
    const errorMsg = errorGlobalLabels?.message || "An unknown error occurred.";
    const errorCode = errorGlobalLabels?.errorCode ? ` (Code: ${errorGlobalLabels.errorCode})` : "";
    return (
      <div className="error-container" style={{ margin: '20px auto', maxWidth: '600px', textAlign: 'center' }}>
        <h1>{globalLabels?.appErrorHeading || "Application Initialization Failed"}</h1>
        <p className="error-text">
          {globalLabels?.appErrorGeneralMessage || "Could not load essential UI text."}
          <br />
          Error details: {errorMsg}{errorCode}
        </p>
        <p>Please try refreshing the page. If the problem persists, contact support.</p>
      </div>
    );
  }

  // Safely access labels with fallbacks
  const appTitleText = globalLabels.appTitle || "Type-Safe Application";
  const switchButtonText = language === 'en' ? globalLabels.switchToChinese : globalLabels.switchToEnglish;
  const footerText = globalLabels.footerText || "© My App";

  return (
    <>
      <header style={{ opacity: isFetchingGlobalLabels && !isPendingGlobalLabels ? 0.7 : 1, paddingBottom: '10px' }}>
        <h1>
          {appTitleText}
          {isFetchingGlobalLabels && !isPendingGlobalLabels && (
            <small style={{ marginLeft: '10px', fontStyle: 'italic', color: '#555' }}>
              {globalLabels.refreshingUITextIndicator || "(Refreshing UI...)"}
            </small>
          )}
        </h1>
        <button onClick={handleToggleLanguage} disabled={isFetchingGlobalLabels}>
          {isFetchingGlobalLabels ? "..." : switchButtonText}
        </button>
      </header>
      <hr />
      <main>
        <MoodHistoryComponent />
      </main>
      <hr />
      <footer style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9em', color: '#777' }}>
        <p>{footerText}</p>
      </footer>
    </>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};

export default App;
```
*Typed as `React.FC`, more robust QueryClient setup (retry logic, global error handlers), used `ApiError`, safer fallbacks for labels.*

---

**15. `src/main.tsx`** (No changes from previous complete example)

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

This comprehensive example emphasizes type safety at multiple levels. The `README.md` provides context, and the code itself uses TypeScript features to create a more robust and maintainable application. Remember to install dependencies and run the development server as described in the README.

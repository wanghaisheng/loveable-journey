

技术架构参考：
*   **`src/types/index.ts`**: Central type definitions.
*   **`src/locales/en.json` & `src/locales/zh.json`**: For the `LanguageProvider`'s general translations (though `MoodHistoryComponent` won't use them for its core content).
*   **`src/context/LanguageProvider.tsx`**: The language context.
*   **`src/api/getMoodHistory.ts`**: The API mock function.
*   **`src/hooks/useInternationalizedQuery.ts`**: The custom query hook.
*   **`src/components/MoodHistoryComponent.tsx`**: The component using the custom hook.
*   **`src/App.tsx`**: The main application component.
*   **`src/main.tsx` (or `index.tsx`)**: The entry point.
*   **`package.json`**: To show dependencies.
*   **`tsconfig.json`**: Basic TypeScript configuration.

**File Structure:**

```
.
├── package.json
├── tsconfig.json
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── types/
    │   └── index.ts
    ├── locales/
    │   ├── en.json
    │   └── zh.json
    ├── context/
    │   └── LanguageProvider.tsx
    ├── api/
    │   └── getMoodHistory.ts
    ├── hooks/
    │   └── useInternationalizedQuery.ts
    └── components/
        └── MoodHistoryComponent.tsx
```

---

**1. `package.json`:**

```json
{
  "name": "react-query-i18n-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.0.0", // Or latest v5
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
```
*Install dependencies: `npm install` or `yarn`*

---

**2. `tsconfig.json`:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"] // Optional: for cleaner imports like @/components/
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }] // If using Vite
}
```
*Create `tsconfig.node.json` if it doesn't exist (Vite default):*
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

---

**3. `src/types/index.ts`:**

```typescript
// src/types/index.ts

// ===== Language Context Types =====
export type Language = "en" | "zh";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string; // General translation function
}

// ===== API and Component Specific Types =====
export interface MoodEntry {
  id: number;
  mood: string;
  date: string;
}

// Comprehensive labels for the MoodHistory component, fetched from API
export interface MoodHistoryComponentLabels {
  sectionTitle: string;
  loadingMessage: string;
  noDataMessage: string;
  errorMessageTemplate: string;
  entriesListHeader?: string;
  refreshButtonText: string;
  apiInfoMessageTemplate?: string;
}

// The actual "data" part of the response
export interface MoodHistoryComponentData {
  entries: MoodEntry[];
  entryCount: number;
}

// This is what getMoodHistory will return
export interface FullMoodHistoryResponse {
  labels: MoodHistoryComponentLabels;
  data: MoodHistoryComponentData;
}
```

---

**4. `src/locales/en.json`:**

```json
{
  "appTitle": "My App with Internationalized Data",
  "switchToChinese": "Switch to 中文",
  "generalError": "An unexpected error occurred."
}
```

---

**5. `src/locales/zh.json`:**

```json
{
  "appTitle": "我的国际化数据应用",
  "switchToEnglish": "切换到 English",
  "generalError": "发生了一个意外错误。"
}
```

---

**6. `src/context/LanguageProvider.tsx`:**

```tsx
// src/context/LanguageProvider.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import type { Language, LanguageContextType } from '../types';

const defaultLanguage: Language = "en";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    return (savedLanguage && (savedLanguage === "en" || savedLanguage === "zh")) ? savedLanguage : defaultLanguage;
  });
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadTranslations = async () => {
      if (!language) return;
      try {
        // Vite handles dynamic imports like this.
        // Ensure your locales are in `public/locales/` or configure Vite to serve them from `src/locales/`
        // For simplicity, let's assume they are in `src/locales` and Vite handles it.
        const translationsModule = await import(`../locales/${language}.json`);
        setTranslations(translationsModule.default || translationsModule);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        setTranslations({});
      }
    };

    loadTranslations();
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string, params?: Record<string, string>) => {
    let text = translations[key] || key;
    if (params) {
      Object.keys(params).forEach((paramKey) => {
        const placeholder = `{{${paramKey}}}`;
        text = text.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), params[paramKey]);
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
```

---

**7. `src/api/getMoodHistory.ts`:**

```typescript
// src/api/getMoodHistory.ts
import type {
  Language,
  FullMoodHistoryResponse,
  MoodEntry,
  MoodHistoryComponentData,
  MoodHistoryComponentLabels
} from '../types';

const getMoodText = (moodKey: 'happy' | 'calm' | 'excited', lang: Language): string => {
  const moods = {
    happy: { en: 'Happy', zh: '开心' },
    calm: { en: 'Calm', zh: '平静' },
    excited: { en: 'Excited', zh: '兴奋' },
  };
  return moods[moodKey][lang] || moods[moodKey]['en'];
};

export async function getMoodHistory(lang: Language): Promise<FullMoodHistoryResponse> {
  console.log("API: Simulating fetch for comprehensive mood history in language:", lang);
  await new Promise(resolve => setTimeout(resolve, 700));

  let labels: MoodHistoryComponentLabels;
  let data: MoodHistoryComponentData;

  const sampleEntries: MoodEntry[] = [
    { id: 1, mood: getMoodText('happy', lang), date: "2024-03-10" },
    { id: 2, mood: getMoodText('calm', lang), date: "2024-03-09" },
  ];

  if (lang === 'zh') {
    labels = {
      sectionTitle: "心情日记 (API)",
      loadingMessage: "正在加载心情记录...",
      noDataMessage: "目前没有心情记录可显示。",
      errorMessageTemplate: "加载数据出错： {message}",
      entriesListHeader: "记录详情:",
      refreshButtonText: "手动刷新",
      apiInfoMessageTemplate: "当前显示 {count} 条 {lang} 的记录。",
    };
    data = Math.random() > 0.3 // Sometimes return data, sometimes empty
      ? { entries: sampleEntries, entryCount: sampleEntries.length }
      : { entries: [], entryCount: 0 };
  } else { // Default to 'en'
    const moreEntries: MoodEntry[] = [
        ...sampleEntries,
        { id: 3, mood: getMoodText('excited', lang), date: "2024-03-08" },
    ];
    labels = {
      sectionTitle: "Mood Journal (API)",
      loadingMessage: "Loading mood history...",
      noDataMessage: "No mood entries available right now.",
      errorMessageTemplate: "Error loading data: {message}",
      entriesListHeader: "Entry Details:",
      refreshButtonText: "Refresh Manually",
      apiInfoMessageTemplate: "Displaying {count} entries for {lang}.",
    };
    data = Math.random() > 0.3
      ? { entries: moreEntries, entryCount: moreEntries.length }
      : { entries: [], entryCount: 0 };
  }
  return { labels, data };
}
```

---

**8. `src/hooks/useInternationalizedQuery.ts`:**

```typescript
// src/hooks/useInternationalizedQuery.ts
import { useQuery, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';

interface InternationalizedQueryFnData<TData, TLabels> {
  data: TData;
  labels: TLabels;
}

interface UseInternationalizedQueryResult<TData, TLabels, TError> {
  data: TData | undefined;
  labels: TLabels | undefined;
  isLoading: boolean;
  isError: boolean;
  error: TError | null;
  refetch: (options?: { throwOnError?: boolean; cancelRefetch?: boolean }) => Promise<any>;
  status: 'pending' | 'error' | 'success';
  isSuccess: boolean;
  isPending: boolean;
}

export function useInternationalizedQuery<
  TQueryFnData extends InternationalizedQueryFnData<TData, TLabels>,
  TError = Error,
  TData = TQueryFnData['data'],
  TLabels = TQueryFnData['labels'],
  TQueryKey extends QueryKey = QueryKey
>(
  options: UseQueryOptions<TQueryFnData, TError, TQueryFnData, TQueryKey>
): UseInternationalizedQueryResult<TData, TLabels, TError> {
  const {
    data: queryResult,
    isLoading,
    isError,
    error,
    refetch,
    status,
    isSuccess,
    isPending,
  } = useQuery<TQueryFnData, TError, TQueryFnData, TQueryKey>(options);

  return {
    data: queryResult?.data,
    labels: queryResult?.labels,
    isLoading,
    isError,
    error,
    refetch,
    status,
    isSuccess,
    isPending,
  };
}
```

---

**9. `src/components/MoodHistoryComponent.tsx`:**

```tsx
// src/components/MoodHistoryComponent.tsx
import React from 'react';
import { useLanguage } from '../context/LanguageProvider';
import { getMoodHistory } from '../api/getMoodHistory';
import { useInternationalizedQuery } from '../hooks/useInternationalizedQuery';
import type {
  FullMoodHistoryResponse,
  MoodHistoryComponentData,
  MoodHistoryComponentLabels
} from '../types';

function MoodHistoryComponent() {
  const { language } = useLanguage();

  const {
    data: moodData,
    labels,
    isLoading,
    isError,
    error,
    refetch,
    status,
  } = useInternationalizedQuery<
    FullMoodHistoryResponse,
    Error,
    MoodHistoryComponentData,
    MoodHistoryComponentLabels
  >({
    queryKey: ['mood-history', language],
    queryFn: () => getMoodHistory(language),
    enabled: !!language,
  });

  if (status === 'pending' || (isLoading && !labels)) {
    return <p>{labels?.loadingMessage || "Loading Mood History..."}</p>;
  }

  if (!labels) {
    return <p>Error: UI Labels for Mood History are not available.</p>;
  }

  if (isError || status === 'error') {
    const errorMessage = error?.message || "Unknown error";
    return <p style={{color: 'red'}}>{labels.errorMessageTemplate.replace('{message}', errorMessage)}</p>;
  }

  if (!moodData) {
    // This state should ideally be covered by previous checks or API always returning data structure
    return <p>{labels.noDataMessage} (Data structure error)</p>;
  }

  const { entries, entryCount } = moodData;
  const apiInfoMessage = labels.apiInfoMessageTemplate
    ? labels.apiInfoMessageTemplate
        .replace('{count}', entryCount.toString())
        .replace('{lang}', language.toUpperCase())
    : `Fetched for ${language.toUpperCase()}`;

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', margin: '10px 0' }}>
      <h2>{labels.sectionTitle} ({language.toUpperCase()})</h2>
      {apiInfoMessage && <p><em>{apiInfoMessage}</em></p>}

      {entries.length === 0 ? (
        <p>{labels.noDataMessage}</p>
      ) : (
        <>
          {labels.entriesListHeader && <h3>{labels.entriesListHeader}</h3>}
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
            {entries.map((entry) => (
              <li key={entry.id}>
                ID: {entry.id}, Mood: {entry.mood}, Date: {entry.date}
              </li>
            ))}
          </ul>
        </>
      )}
      <button onClick={() => refetch()}>{labels.refreshButtonText}</button>
    </div>
  );
}

export default MoodHistoryComponent;
```

---

**10. `src/App.tsx`:**

```tsx
// src/App.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider, useLanguage } from './context/LanguageProvider';
import MoodHistoryComponent from './components/MoodHistoryComponent';
import type { Language } from './types';

const queryClient = new QueryClient();

function AppContent() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    const nextLanguage: Language = language === 'en' ? 'zh' : 'en';
    setLanguage(nextLanguage);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>{t('appTitle')}</h1>
      <button onClick={toggleLanguage} style={{ marginBottom: '20px', padding: '10px' }}>
        {language === 'en' ? t('switchToChinese') : t('switchToEnglish')}
      </button>
      <hr />
      <MoodHistoryComponent />
      {/* You could have other components here using the global `t` function */}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
```

---

**11. `src/main.tsx` (or `index.tsx`):**

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // Optional: for basic styling

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```
*(Create `src/index.css` if you want basic global styles, e.g., `body { margin: 0; }`)*

---

**To Run This Example:**

1.  Save all files in the specified structure.
2.  Open your terminal in the project's root directory.
3.  Run `npm install` (or `yarn`).
4.  Run `npm run dev` (or `yarn dev`).
5.  Open your browser to the address Vite provides (usually `http://localhost:5173`).

You should see the application. You can toggle the language and observe:
*   The "App Title" and "Switch to..." button text change based on `LanguageProvider`'s `t` function and `locales/*.json`.
*   The `MoodHistoryComponent` fetches its own data and labels based on the current language. All text within this component (title, loading, error, no data, button) comes directly from the API response, as orchestrated by `useInternationalizedQuery`.
*   The API mock (`getMoodHistory`) will sometimes return empty data for `MoodHistoryComponent` to demonstrate the "no data" message.

This complete example demonstrates the pattern of fetching comprehensive, pre-translated labels along with data for specific components, using a custom hook to streamline the process with React Query.

{{{{prd}}}



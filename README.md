# Luca Stay Admin

React, TypeScript, Vite, Tailwind CSS, React Router, i18next, and React Query.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run lint:fix
npm run preview
```

## Project Structure

```txt
src/
  app/
    App.tsx
    router.tsx

  modules/
    dashboard/          ← reference module (use this pattern)
    auth/
    devices/
    (settings)/
    (properties)/
    (reservations)/
    (financial)/
    (services)/
    error/

  components/
    forms/
    layout/
    routes/
    shared/
    ui/

  hooks/
  i18n/
  utils/
  constants/
  styles/
  types/
  assets/
```

Feature code lives in **`src/modules/<feature>/`**. Shared UI stays in `src/components`.

---

## Module Structure (Dashboard as reference)

Use the Dashboard module as the template for any new feature.

```txt
src/modules/dashboard/
│
├── Dashboard.tsx                    # Page entry — compose UI, own screen state
│
├── components/                      # Feature-only UI
│   ├── DashboardHeaderActions.tsx   # Filters / actions bound to page state
│   ├── DashboardSkeleton.tsx        # Loading placeholders matching layout
│   ├── StatsOverview.tsx
│   ├── PerformanceOverview.tsx
│   ├── OperationsCard.tsx
│   ├── ReservationsOverview.tsx
│   └── table/
│       ├── ReservationColumns.tsx   # Column definitions
│       └── DashboardsTable.tsx
│
├── hooks/
│   └── useDashboards.ts             # React Query wiring (queryKey + queryFn)
│
├── services/
│   └── dashboard.service.ts         # API calls + response → UI mapping
│
├── types/
│   ├── dashboard.types.ts           # UI / domain types used by components
│   └── dashboard.api.types.ts       # Raw API response shapes
│
├── constants/
│   └── dashboard.constants.ts       # Endpoints, enums, query keys, UI config
│
└── icons/                           # Optional — feature-specific icons
    └── DashboardIcons.tsx
```

### Responsibility of each folder

| Folder / file          | Owns                                                            | Does not own                       |
| ---------------------- | --------------------------------------------------------------- | ---------------------------------- |
| `FeaturePage.tsx`      | Layout composition, screen state (filters), loading / error UI  | API details, raw response shapes   |
| `components/`          | Presentational pieces for this feature                          | Shared app-wide UI                 |
| `hooks/`               | React Query (or mutations) that call services                   | `fetch` / endpoints                |
| `services/`            | Endpoints, `apiRequest`, `Promise.all`, mappers UI ← API        | JSX                                |
| `types/*.types.ts`     | Domain models used by UI                                        | Backend field names if they differ |
| `types/*.api.types.ts` | Exact API payloads                                              | UI-only enums / labels             |
| `constants/`           | `QUERY_KEY`, endpoints map, enums (`0`–`n` filters), style maps | Business mapping logic             |
| `icons/`               | Local SVG / icon map                                            | Global sidebar icons               |

### Copy-paste skeleton for a new module

```txt
src/modules/<feature>/
├── <Feature>Page.tsx
├── components/
│   ├── <Feature>Skeleton.tsx
│   └── table/
│       └── <Feature>Columns.tsx
├── hooks/
│   └── use<Feature>.ts
├── services/
│   └── <feature>.service.ts
├── types/
│   ├── <feature>.types.ts
│   └── <feature>.api.types.ts
└── constants/
    └── <feature>.constants.ts
```

Replace `<feature>` with the domain name (`devices`, `invoices`, `cities`, …).

---

## Dashboard Data Flow (pattern to reuse)

```txt
Page state (period filter)
        │
        ▼
  useDashboardData(period)     ← hooks/  React Query
        │
        ▼
  fetchDashboardData(...)      ← services/  Promise.all of endpoints
        │
        ▼
  map API → DashboardData      ← services/  keep components dumb
        │
        ▼
  components render UI types   ← types/dashboard.types.ts
```

### 1. Constants — endpoints, enums, query key

```ts
// constants/dashboard.constants.ts
export const DASHBOARD_QUERY_KEY = 'dashboard' as const;

export const DASHBOARD_ENDPOINTS = {
  operationsSummary: 'Bookings/operations-summary',
  performanceOverview: 'Bookings/performance-overview',
  reservationsOverview: 'Bookings/reservations-overview',
} as const;

export enum DateRangeFilter {
  Last7Days = 0,
  ThisWeek = 1,
  ThisMonth = 2,
  ThisYear = 3,
}
```

Use numeric enums when the API expects `integer` query filters.

### 2. Types — split UI vs API

```ts
// types/dashboard.api.types.ts  → mirrors backend JSON
export type OperationsSummaryApi = { overview: {...}; operations: {...} };

// types/dashboard.types.ts      → what components consume
export type DashboardStat = { key: DashboardStatKey; value: string };
```

### 3. Service — parallel requests + mapping

```ts
// services/dashboard.service.ts
export async function fetchDashboardData(period: DateRangeFilter, locale: string) {
  const [operationsSummary, occupancy, reservations, list] = await Promise.all([
    getOperationsSummary(period),
    getPerformanceOverview(period, PerformanceMetricType.Occupancy),
    getPerformanceOverview(period, PerformanceMetricType.Reservations),
    getReservationsOverview(),
  ]);

  return mapDashboardData(...); // API shapes → UI models
}
```

Rules:

- Always use `apiRequest` + `generateQueryParams`.
- Unwrap `{ result }` in the service, not in components.
- Keep mappers next to the service (or in `utils/` if reused).

### 4. Hook — React Query only

```ts
// hooks/useDashboards.ts
export const useDashboardData = (period: DateRangeFilter) => {
  return useQuery({
    queryKey: [DASHBOARD_QUERY_KEY, period, locale],
    queryFn: () => fetchDashboardData(period, locale),
    placeholderData: keepPreviousData, // smooth period changes
  });
};
```

### 5. Page — compose + loading UX

```tsx
// Dashboard.tsx
const [period, setPeriod] = useState(DateRangeFilter.Last7Days);
const { data, isLoading, isFetching, isError } = useDashboardData(period);

// First load → feature skeleton (not a blank spinner)
// Refetch    → keep previous UI, reduce opacity
// Error      → ErrorPage only when there is no cached data
```

Skeleton component should mirror the real layout (`DashboardSkeleton.tsx`).

---

## Folder Rules (app-wide)

### `src/app`

- `App.tsx` — providers (`QueryClient`, router, toaster).
- `router.tsx` — lazy routes; feature pages import from `modules/`.

### `src/modules`

Domain features. Prefer colocation (components, hooks, services, types next to the page).

Route groups like `(settings)` / `(financial)` are organizational only — they do not affect URLs.

### `src/components`

Reusable across features:

- `forms/` — RHF custom fields
- `layout/` — `AppLayout`, `AuthLayout`, `PageLayout`
- `shared/` — `CustomTable`, loaders, badges
- `ui/` — shadcn primitives

### `src/hooks` / `src/utils` / `src/i18n`

Cross-cutting only. Feature-specific hooks stay inside the module.

---

## API Rules

```ts
apiRequest<ResponseType>('Bookings/operations-summary', { method: 'GET' });

apiRequest<ResponseType>('Account/adminLogin', {
  method: 'POST',
  skipAuth: true,
  body: payload,
});
```

Do not add auth headers or stringify bodies manually — `apiRequest` handles that.

---

## Naming Conventions

| Kind      | Pattern                                 | Example                  |
| --------- | --------------------------------------- | ------------------------ |
| Page      | `PascalCase.tsx` or `SomethingPage.tsx` | `Dashboard.tsx`          |
| Service   | `<feature>.service.ts`                  | `dashboard.service.ts`   |
| UI types  | `<feature>.types.ts`                    | `dashboard.types.ts`     |
| API types | `<feature>.api.types.ts`                | `dashboard.api.types.ts` |
| Hook      | `use<Feature>.ts`                       | `useDashboards.ts`       |
| Constants | `<feature>.constants.ts`                | `dashboard.constants.ts` |
| Query key | `<FEATURE>_QUERY_KEY`                   | `DASHBOARD_QUERY_KEY`    |
| Skeleton  | `<Feature>Skeleton.tsx`                 | `DashboardSkeleton.tsx`  |

---

## i18n

Feature strings live under a matching key in locale files:

```txt
i18n/locales/en.json  →  "dashboard": { ... }
i18n/locales/it.json  →  "dashboard": { ... }
```

Prefer translation keys over hardcoded labels in components.

---

## Verification

```bash
npm run lint
npm run build
```
#   I t q a n - c l i e n t  
 #   I t q a n - c l i e n t  
 
## 1. Folder structure

```text
src/
├── app/
│   ├── animal/
│   │   ├── [id].tsx
│   │   └── new.tsx
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── verify-otp.tsx
│   ├── index.tsx
│   ├── _layout.tsx
│   ├── +not-found.tsx
│   ├── onboarding/
│   │   ├── geofence-intro.tsx
│   │   ├── illness-detection.tsx
│   │   ├── index.tsx
│   │   ├── language-select.tsx
│   │   └── _layout.tsx
│   ├── settings/
│   │   ├── about.tsx
│   │   ├── device-diagnostics.tsx
│   │   ├── edit-profile.tsx
│   │   ├── language.tsx
│   │   └── privacy-policy.tsx
│   ├── (tabs)/
│   │   ├── alerts.tsx
│   │   ├── herd.tsx
│   │   ├── index.tsx
│   │   ├── _layout.tsx
│   │   ├── map.tsx
│   │   └── settings.tsx
│   └── zones/
│       └── index.tsx
├── components/
│   ├── alerts/
│   │   ├── alert-filter-chips.tsx
│   │   ├── alert-icon.tsx
│   │   └── alert-row.tsx
│   ├── animal-detail/
│   │   ├── activity-timeline-bar.tsx
│   │   ├── alert-history-item.tsx
│   │   ├── collar-actions.tsx
│   │   ├── locate-sheet.tsx
│   │   ├── location-card.tsx
│   │   ├── power-toggle.tsx
│   │   ├── pulse-rings.tsx
│   │   ├── shutdown-sheet.tsx
│   │   └── vitals-row.tsx
│   ├── herd/
│   │   ├── animal-card.tsx
│   │   ├── avatar.tsx
│   │   ├── filter-chips.tsx
│   │   ├── health-summary-card.tsx
│   │   └── status-badge.tsx
│   ├── home/
│   │   ├── alert-row.tsx
│   │   ├── health-summary-card.tsx
│   │   └── recent-activity-row.tsx
│   ├── map/
│   │   ├── all-animals-sheet.tsx
│   │   ├── animal-callout.tsx
│   │   ├── animal-marker.tsx
│   │   ├── farm-header-pill.tsx
│   │   └── map-action-button.tsx
│   ├── onboarding/
│   │   ├── language-card.tsx
│   │   └── language-grid.tsx
│   ├── settings/
│   │   ├── section-header.tsx
│   │   └── settings-row.tsx
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   ├── ui/
│   │   ├── icon-symbol.tsx
│   │   └── tab-icon.tsx
│   └── zones/
│       ├── danger-zone-row.tsx
│       └── zone-card.tsx
├── constants/
│   └── theme.ts
├── global.css
├── hooks/
│   ├── mutations/
│   │   ├── use-create-zone.ts
│   │   ├── use-locate-animal.ts
│   │   ├── use-shutdown-collar.ts
│   │   ├── use-toggle-zone.ts
│   │   ├── use-update-preferences.ts
│   │   ├── use-update-profile.ts
│   │   ├── use-update-zone-shape.ts
│   │   └── use-upload-avatar.ts
│   ├── queries/
│   │   ├── use-activity-timeline.ts
│   │   ├── use-alerts.ts
│   │   ├── use-animal-alert-history.ts
│   │   ├── use-animal-detail.ts
│   │   ├── use-animal-positions.ts
│   │   ├── use-animal.ts
│   │   ├── use-base-station-status.ts
│   │   ├── use-danger-zones.ts
│   │   ├── use-device-diagnostics.ts
│   │   ├── use-farm.ts
│   │   ├── use-herd-summary.ts
│   │   ├── use-herd.ts
│   │   ├── use-preferences.ts
│   │   ├── use-recent-animals.ts
│   │   ├── use-resolve-alert.ts
│   │   ├── use-user-detail.ts
│   │   └── use-zones.ts
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   ├── use-current-user.ts
│   ├── use-debounced-value.ts
│   ├── use-onboarding-status.ts
│   ├── use-theme.ts
│   └── use-weather.ts
├── services/
│   ├── api/
│   │   ├── alerts.ts
│   │   ├── animals.ts
│   │   ├── client.ts
│   │   ├── farm.ts
│   │   ├── settings.ts
│   │   ├── user.ts
│   │   └── zones.ts
│   ├── i18n/
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── bn.json
│   │       ├── en.json
│   │       ├── gu.json
│   │       ├── hi.json
│   │       ├── kn.json
│   │       ├── mr.json
│   │       ├── ta.json
│   │       └── te.json
│   └── weather.ts
└── types/
    ├── alert.ts
    ├── animal.ts
    ├── settings.ts
    ├── user.ts
    └── zone.ts
```

## 2. Full API contract (as implemented, not as originally spec'd)

### src/services/api/client.ts

- Exported function: `apiGet<T>(path: string)`
  - Method: `GET`
  - Exact URL path: `BASE_URL + path` where `BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.herdos.app'`
  - Request body shape: none
  - Return type: `Promise<T>` from the caller's generic type parameter
  - Implementation detail: adds `Authorization: Bearer ${token}` only when `AsyncStorage.getItem('herdos:authToken')` returns a non-empty token.

- Exported function: `apiPost<T>(path: string, body: unknown)`
  - Method: `POST`
  - Exact URL path: `BASE_URL + path`
  - Request body shape: JSON-serialized `body` via `JSON.stringify(body)`
  - Return type: `Promise<T>` from the caller's generic type parameter

- Exported function: `apiPut<T>(path: string, body: unknown)`
  - Method: `PUT`
  - Exact URL path: `BASE_URL + path`
  - Request body shape: JSON-serialized `body` via `JSON.stringify(body)`
  - Return type: `Promise<T>` from the caller's generic type parameter

- Exported function: `apiPatch<T>(path: string, body: unknown)`
  - Method: `PATCH`
  - Exact URL path: `BASE_URL + path`
  - Request body shape: JSON-serialized `body` via `JSON.stringify(body)`
  - Return type: `Promise<T>` from the caller's generic type parameter

### src/services/api/alerts.ts

- Exported function: `getAlerts(params: { limit?: number; acknowledged?: boolean; animalId?: string; resolvedOnly?: boolean } = {})`
  - Method: `GET`
  - Exact URL path: `/alerts` plus query params built from `limit`, `acknowledged`, `animalId`, and `resolvedOnly`
  - Query param shape:
    - `limit` when numeric
    - `acknowledged` when boolean
    - `animalId` when provided
    - `resolvedOnly` when boolean
  - Request body shape: none
  - Return type: `Promise<HerdAlert[]>` where `HerdAlert` is from [src/types/alert.ts](src/types/alert.ts)
  - Discrepancy note: the function name suggests a list of alerts, and the implementation actually builds a query string on `/alerts` rather than a dedicated `GET /alerts/list` endpoint.

- Exported function: `resolveAlert(id: string)`
  - Method: `PATCH`
  - Exact URL path: `/alerts/${id}`
  - Request body shape: `{ acknowledged: true }`
  - Return type: `Promise<HerdAlert>`

- Exported function: `acknowledgeAlert(id: string)`
  - Method: `PATCH`
  - Exact URL path: `/alerts/${id}`
  - Request body shape: `{ acknowledged: true }`
  - Return type: `Promise<HerdAlert>`
  - Discrepancy note: this is not a separate endpoint; it is an alias wrapper around `resolveAlert(id)`.

### src/services/api/animals.ts

- Exported function: `getAnimals(params: { status?: AnimalStatus | 'all'; search?: string; sort?: 'recent'; limit?: number })`
  - Method: `GET`
  - Exact URL path: `/animals` plus query params built from `status`, `search`, `sort`, and `limit`
  - Query param shape:
    - `status` when provided and not `'all'`
    - `search` when provided
    - `sort` when provided
    - `limit` when numeric
  - Request body shape: none
  - Return type: `Promise<Animal[]>` where `Animal` is from [src/types/animal.ts](src/types/animal.ts)

- Exported function: `getAnimalSummary()`
  - Method: `GET`
  - Exact URL path: `/animals/summary`
  - Request body shape: none
  - Return type: `Promise<{ healthy: number; watch: number; alert: number }>`

- Exported function: `getAnimal(id: string)`
  - Method: `GET`
  - Exact URL path: `/animals/${id}`
  - Request body shape: none
  - Return type: `Promise<AnimalDetail>` where `AnimalDetail` is from [src/types/animal.ts](src/types/animal.ts)

- Exported function: `getActivityTimeline(animalId: string, date?: string)`
  - Method: `GET`
  - Exact URL path: `/animals/${animalId}/activity-timeline` plus optional `?date=<date>` query param
  - Request body shape: none
  - Return type: `Promise<{ segments: ActivitySegment[] }>` where `ActivitySegment` is from [src/types/animal.ts](src/types/animal.ts)

- Exported function: `locateAnimal(animalId: string)`
  - Method: `POST`
  - Exact URL path: `/animals/${animalId}/locate`
  - Request body shape: `{}`
  - Return type: `Promise<{ success: boolean }>`
  - Discrepancy note: the function name implies a side-effect action, and the implementation does exactly that with a POST to a locate endpoint.

- Exported function: `shutdownCollar(animalId: string)`
  - Method: `POST`
  - Exact URL path: `/animals/${animalId}/shutdown-collar`
  - Request body shape: `{}`
  - Return type: `Promise<{ success: boolean }>`

- Exported function: `getRecentAnimals(limit?: number)`
  - Method: `GET`
  - Exact URL path: `/animals` with `sort=recent` and optional `limit=<n>` built by delegating to `getAnimals()`
  - Request body shape: none
  - Return type: `Promise<Animal[]>`

- Exported function: `getAnimalPositions()`
  - Method: `GET`
  - Exact URL path: `/animals/positions`
  - Request body shape: none
  - Return type: `Promise<AnimalPosition[]>` where `AnimalPosition` is from [src/types/animal.ts](src/types/animal.ts)

- Exported function: `acknowledgeAnimal(id: string)`
  - Method: `PATCH`
  - Exact URL path: `/animals/${id}`
  - Request body shape: `{ acknowledged: true }`
  - Return type: `Promise<Animal>`

### src/services/api/farm.ts

- Exported type: `Farm`
  - Shape:
    - `id: string`
    - `name: string`
    - `lat: number`
    - `lng: number`
    - `onlineCount: number`
    - `totalCount: number`

- Exported function: `getFarm()`
  - Method: `GET`
  - Exact URL path: `/farm`
  - Request body shape: none
  - Return type: `Promise<Farm>`

### src/services/api/settings.ts

- Exported function: `getPreferences()`
  - Method: `GET`
  - Exact URL path: `/me/preferences`
  - Request body shape: none
  - Return type: `Promise<Preferences>` where `Preferences` is from [src/types/settings.ts](src/types/settings.ts)

- Exported function: `updatePreferences(patch: Partial<Preferences>)`
  - Method: `PATCH`
  - Exact URL path: `/me/preferences`
  - Request body shape: `patch`
  - Return type: `Promise<Preferences>`

- Exported function: `updateProfile(patch: { name?: string; location?: string; avatarUrl?: string })`
  - Method: `PATCH`
  - Exact URL path: `/me`
  - Request body shape: `patch`
  - Return type: `Promise<User>` where `User` is from [src/types/user.ts](src/types/user.ts)

- Exported function: `uploadAvatar(uri: string)`
  - Method: `POST`
  - Exact URL path: `${process.env.EXPO_PUBLIC_API_URL ?? 'https://api.herdos.app'}/me/avatar`
  - Request body shape: `FormData` with field name `avatar` and a JPEG file object
  - Return type: `Promise<{ avatarUrl: string }>`
  - Discrepancy note: this bypasses the shared `client.ts` request wrapper and does not send the `Authorization: Bearer ...` header. It also uses a direct `fetch(...)` instead of the shared `apiPost` helper.

- Exported function: `getBaseStationStatus()`
  - Method: `GET`
  - Exact URL path: `/device/base-station-status`
  - Request body shape: none
  - Return type: `Promise<{ connected: boolean }>`

- Exported function: `getDeviceDiagnostics()`
  - Method: `GET`
  - Exact URL path: `/device/diagnostics`
  - Request body shape: none
  - Return type: `Promise<{ collars: CollarDiagnostic[] }>` where `CollarDiagnostic` is from [src/types/settings.ts](src/types/settings.ts)

### src/services/api/user.ts

- Exported type: `CheckPhoneResponse`
  - Shape:
    - `exists: boolean`
    - `verified?: boolean`
    - `otpSent?: boolean`

- Exported function: `checkPhone(payload: { name?: string; phone: string })`
  - Method: `POST`
  - Exact URL path: `/auth/check-phone`
  - Request body shape: `{ name?: string; phone: string }`
  - Return type: `Promise<CheckPhoneResponse>`

- Exported function: `verifyOtp(payload: { phone: string; otp: string; name?: string })`
  - Method: `POST`
  - Exact URL path: `/auth/verify-otp`
  - Request body shape: `{ phone: string; otp: string; name?: string }`
  - Return type: `Promise<{ verified: boolean }>`

- Exported function: `getUserByPhone(phone: string)`
  - Method: `GET`
  - Exact URL path: `/user?phone=${encodeURIComponent(phone)}`
  - Request body shape: none
  - Return type: `Promise<User>` where `User` is from [src/types/user.ts](src/types/user.ts)

### src/services/api/zones.ts

- Exported function: `getZones()`
  - Method: `GET`
  - Exact URL path: `/zones`
  - Request body shape: none
  - Return type: `Promise<FenceZone[]>` where `FenceZone` is from [src/types/zone.ts](src/types/zone.ts)

- Exported function: `createZone(input: { name: string; points: GeofencePoint[] })`
  - Method: `POST`
  - Exact URL path: `/zones`
  - Request body shape: `{ name: string; points: GeofencePoint[] }`
  - Return type: `Promise<FenceZone>`

- Exported function: `updateZoneShape(id: string, points: GeofencePoint[])`
  - Method: `PATCH`
  - Exact URL path: `/zones/${id}`
  - Request body shape: `{ points }`
  - Return type: `Promise<FenceZone>`

- Exported function: `toggleZone(id: string, active: boolean)`
  - Method: `PATCH`
  - Exact URL path: `/zones/${id}`
  - Request body shape: `{ active }`
  - Return type: `Promise<FenceZone>`

- Exported function: `getDangerZones()`
  - Method: `GET`
  - Exact URL path: `/danger-zones`
  - Request body shape: none
  - Return type: `Promise<DangerZone[]>` where `DangerZone` is from [src/types/zone.ts](src/types/zone.ts)

## 3. All type definitions, verbatim

### src/types/alert.ts

```ts
export type AlertSeverity = 'low' | 'medium' | 'high';

export type AlertType = 'panic' | 'temperature' | 'tamper' | 'geofence' | 'sound';

export type HerdAlert = {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  createdAt: string;
  animalId?: string;
  animalName?: string;
  type?: AlertType;
  message?: string;
  acknowledged?: boolean;
  resolvedAt?: string | null;
};
```

### src/types/animal.ts

```ts
export type AnimalStatus = 'healthy' | 'watch' | 'alert' | 'lame' | 'milking' | 'pregnant';

export interface Animal {
  id: string;
  name: string;
  breed: string;
  ageYears: number;
  status: AnimalStatus;
  photoUrl?: string;
  collarId: string;
  lastSeenAt: string;
}

export interface AnimalPosition {
  animalId: string;
  lat: number;
  lng: number;
  status: AnimalStatus;
  updatedAt: string;
}

export interface AnimalDetail extends Animal {
  bodyTempC: number;
  activityPercent: number;
  ruminationHours: number;
  lastKnownLat: number;
  lastKnownLng: number;
}

export interface ActivitySegment {
  startHour: number;
  endHour: number;
  type: 'grazing' | 'resting' | 'active';
}
```

### src/types/settings.ts

```ts
export interface Preferences {
  notifications: boolean;
  audioAlerts: boolean;
  alertVolume: number;
  collarBatteryAlerts: boolean;
  language: string;
}

export interface CollarDiagnostic {
  id: string;
  animalName: string;
  batteryPercent: number;
  signalStrength: number;
  lastSyncAt: string;
}
```

### src/types/user.ts

```ts
export type User = {
  userName: string;
  phoneNO: string;
  phone?: string;
  name?: string;
  location?: string;
  avatarUrl?: string;
};
```

### src/types/zone.ts

```ts
export interface GeofencePoint {
  lat: number;
  lng: number;
}

export interface FenceZone {
  id: string;
  name: string;
  points: GeofencePoint[];
  active: boolean;
  animalCount: number;
}

export interface DangerZone {
  id: string;
  name: string;
  points: GeofencePoint[];
}
```

## 4. Auth integration — THIS IS THE MOST IMPORTANT SECTION

### What the app actually uses for logged-in user lookup

There is no pre-existing app-wide `AuthContext`, `AuthProvider`, `useAuth`, `useUser`, or `SessionContext` implementation in the source tree.

The actual user-resolution path is the fallback hook in [src/hooks/use-current-user.ts](src/hooks/use-current-user.ts):

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';

import { apiGet } from '@/services/api/client';
import type { User } from '@/types/user';

const CURRENT_USER_QUERY_KEY = ['current-user'];

async function readStoredUserFallback(): Promise<User> {
  const [name, phone, location, avatarUrl] = await Promise.all([
    AsyncStorage.getItem('herdos:authName'),
    AsyncStorage.getItem('herdos:authPhone'),
    AsyncStorage.getItem('herdos:location'),
    AsyncStorage.getItem('herdos:avatarUrl'),
  ]);

  const resolvedName = name?.trim() || 'Herdos User';
  const resolvedPhone = phone ?? '';

  return {
    userName: resolvedName,
    phoneNO: resolvedPhone,
    phone: resolvedPhone,
    name: resolvedName,
    location: location ?? undefined,
    avatarUrl: avatarUrl ?? undefined,
  };
}

async function getCurrentUser(): Promise<User> {
  const token = await AsyncStorage.getItem('herdos:authToken');

  if (!token) {
    return readStoredUserFallback();
  }

  return apiGet<User>('/me');
}

export function useCurrentUser() {
  return useQuery<User, Error>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUser,
  });
}
```

That means the Settings prompt did not find a pre-existing auth context/hook; it used the `useCurrentUser()` fallback from [src/hooks/use-current-user.ts](src/hooks/use-current-user.ts), which reads stored fields from AsyncStorage and only falls back to `/me` when a token exists.

### Returned user object fields

The fields returned by the current-user resolution path are exactly:

- `userName: string`
- `phoneNO: string`
- `phone?: string`
- `name?: string`
- `location?: string`
- `avatarUrl?: string`

These fields come from the `User` type in [src/types/user.ts](src/types/user.ts).

### Real usage example from a consumer

The settings screen calls it in [src/app/(tabs)/settings.tsx](src/app/(tabs)/settings.tsx):

```ts
const { data: currentUser } = useCurrentUser();

const avatarSource = currentUser?.avatarUrl ? { uri: currentUser.avatarUrl } : undefined;
const label = currentUser?.name || currentUser?.userName || 'Herdos User';
const location = currentUser?.location || 'Location not set';
```

The same hook is consumed in [src/app/settings/edit-profile.tsx](src/app/settings/edit-profile.tsx) as well for profile editing state.

### How the auth token is attached to outgoing API requests

The token attachment is centralized in [src/services/api/client.ts](src/services/api/client.ts):

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.herdos.app';

async function request<T>(path: string, init: RequestInit = {}) {
  const token = await AsyncStorage.getItem('herdos:authToken');
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...init,
  });
```

So the app’s shared fetch wrapper appends:

- `Authorization: Bearer <token>` when `AsyncStorage.getItem('herdos:authToken')` returns a value.

### AsyncStorage key names used for auth/session persistence

From the login and OTP flow, the app persists:

- `herdos:authPhone`
- `herdos:authName`
- `herdos:loggedIn`

From the current-user fallback and API client, it reads:

- `herdos:authToken`
- `herdos:location`
- `herdos:avatarUrl`

Important note: the login screens store `authPhone` and `authName`, and they set `loggedIn=true`, but they do not write `herdos:authToken` anywhere in the source inspected. The token is only read by the client and fallback hook.

## 5. Environment variables

Grep result in `src/` for `process.env.EXPO_PUBLIC_`:

- `process.env.EXPO_PUBLIC_API_URL` in [src/services/api/client.ts](src/services/api/client.ts)
  - Used as `BASE_URL`, defaulting to `https://api.herdos.app`
- `process.env.EXPO_PUBLIC_API_URL` in [src/services/api/settings.ts](src/services/api/settings.ts)
  - Used directly for avatar upload: `${process.env.EXPO_PUBLIC_API_URL ?? 'https://api.herdos.app'}/me/avatar`

No other `process.env.EXPO_PUBLIC_` references were found under `src/`.

## 6. Open judgment calls from earlier work — answer each specifically

### 6.1 What auth mechanism did the Settings prompt actually find/use — a pre-existing hook, or the useCurrentUser() fallback?

It used the fallback hook in [src/hooks/use-current-user.ts](src/hooks/use-current-user.ts), not a pre-existing auth context. The actual code path is:

```ts
const { data: currentUser } = useCurrentUser();
```

from [src/app/(tabs)/settings.tsx](src/app/(tabs)/settings.tsx).

### 6.2 What WMO weather-code-to-condition mapping does src/services/weather.ts use — list the exact codes handled.

From [src/services/weather.ts](src/services/weather.ts), the mapping is:

- `0: 'Sunny'`
- `1: 'Sunny'`
- `2: 'Partly cloudy'`
- `3: 'Cloudy'`
- `45: 'Foggy'`
- `48: 'Foggy'`
- `51: 'Drizzly'`
- `53: 'Drizzly'`
- `55: 'Drizzly'`
- `56: 'Freezing drizzle'`
- `57: 'Freezing drizzle'`
- `61: 'Rainy'`
- `63: 'Rainy'`
- `65: 'Rainy'`
- `66: 'Freezing rain'`
- `67: 'Freezing rain'`
- `71: 'Snowy'`
- `73: 'Snowy'`
- `75: 'Snowy'`
- `77: 'Snowy'`
- `80: 'Rainy'`
- `81: 'Rainy'`
- `82: 'Rainy'`
- `85: 'Snowy'`
- `86: 'Snowy'`
- `95: 'Stormy'`
- `96: 'Stormy'`
- `99: 'Stormy'`

Anything else falls through to `'Unknown'`.

### 6.3 Were react-native-reanimated and react-native-gesture-handler already present before the Map prompt, or newly added? Check package.json's git history if possible, otherwise just confirm current versions.

Current versions in [package.json](package.json):

- `react-native-gesture-handler`: `~2.32.0`
- `react-native-reanimated`: `4.5.1`

Git history check on `package.json` showed:

- `0d4a2f4 feat: add animal detail components and functionality`
- `6a02ef2 base set of the ui`
- `c22deec Initial commit`

So the manifest already contains these packages in the repo history; there is no evidence in the inspected git history that they were newly introduced only for the map prompt. The current repo state includes both.

### 6.4 What was the exhaustive list of files touched when the single-geofence model was removed and replaced with multi-zone? (grep for any remaining references to `farm.geofence`, `GeofencePoint`, `use-update-geofence` — report if any leftover references still exist, since they shouldn't)

The current remaining references are:

- [src/types/zone.ts](src/types/zone.ts) — `GeofencePoint` still exists as the point type.
- [src/services/api/zones.ts](src/services/api/zones.ts) — `GeofencePoint` is used in zone creation/update payloads.
- [src/app/(tabs)/map.tsx](src/app/(tabs)/map.tsx) — the editing/creation flow still uses `GeofencePoint[]` for the draft polygon points.

Search results for the legacy strings showed:

- `farm.geofence` — no remaining references
- `use-update-geofence` — no remaining references

So the old single-geofence model references are not present in the current source tree. The current implementation is clearly a multi-zone approach based on `zones` and `danger-zones`, with `GeofencePoint` retained as the shared point shape.

### 6.5 How was the "insert point on long-press" and "tap-to-add-point" interaction actually implemented in the zone-drawing screen? Quote the relevant logic.

The actual interaction is in [src/app/(tabs)/map.tsx](src/app/(tabs)/map.tsx):

```tsx
<MapView
  ref={mapRef}
  provider="google"
  style={styles.map}
  mapType="satellite"
  initialRegion={initialRegion}
  onPress={(event) => {
    if (createZone !== 'true') {
      return;
    }

    handleAddDraftPoint({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude,
    });
  }}
  onLongPress={(event) => {
    if (!editZoneId || draftPoints.length < 2) {
      return;
    }

    const target = {
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude,
    };

    const nearestIndex = draftPoints.reduce((bestIndex, point, index) => {
      const bestDistance = draftPoints[bestIndex] ? Math.hypot(point.lat - target.lat, point.lng - target.lng) : Number.POSITIVE_INFINITY;
      const currentDistance = Math.hypot(point.lat - target.lat, point.lng - target.lng);
      return currentDistance < bestDistance ? index : bestIndex;
    }, 0);

    const nextIndex = (nearestIndex + 1) % draftPoints.length;
    const insertIndex = Math.min(nearestIndex, nextIndex) + 1;
    const inserted = [...draftPoints];
    inserted.splice(insertIndex, 0, target);
    setDraftPoints(inserted);
  }}
>
```

Interpretation:

- Tap on the map while `createZone=true` adds a point to `draftPoints` by calling `handleAddDraftPoint()`.
- Long-press during zone edit inserts a new point nearest the pressed location, by finding the closest existing vertex and splicing it into the draft point list.

### 6.6 What's the small addition made to map.tsx for the focusAnimalId (and focusZoneId, if present) query params? Quote it.

The map screen now reads both params from the route in [src/app/(tabs)/map.tsx](src/app/(tabs)/map.tsx):

```ts
const { editZoneId, createZone, focusAnimalId, focusZoneId } = useLocalSearchParams<{
  editZoneId?: string;
  createZone?: string;
  focusAnimalId?: string;
  focusZoneId?: string;
}>();
```

And it implements the behavior with two effects:

```ts
useEffect(() => {
  if (!focusAnimalId || !positions?.length) {
    return;
  }

  const targetId = Array.isArray(focusAnimalId) ? focusAnimalId[0] : focusAnimalId;
  const targetPosition = positions.find((position) => position.animalId === targetId);

  if (!targetPosition) {
    return;
  }

  setSelectedAnimalId(targetId);
  mapRef.current?.animateToRegion(
    {
      latitude: targetPosition.lat,
      longitude: targetPosition.lng,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    },
    400,
  );
}, [focusAnimalId, positions]);
```

```ts
useEffect(() => {
  if (!focusZoneId || !zones.length) {
    return;
  }

  const targetId = Array.isArray(focusZoneId) ? focusZoneId[0] : focusZoneId;
  const targetZone = zones.find((zone) => zone.id === targetId);

  if (!targetZone?.points.length) {
    return;
  }

  const latitudes = targetZone.points.map((point) => point.lat);
  const longitudes = targetZone.points.map((point) => point.lng);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  mapRef.current?.animateToRegion(
    {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max((maxLat - minLat) * 1.6, 0.02),
      longitudeDelta: Math.max((maxLng - minLng) * 1.6, 0.02),
    },
    400,
  );
}, [focusZoneId, zones]);
```

### 6.7 Does BottomSheetModalProvider wrap the app, and where exactly was it added (quote the relevant part of src/app/_layout.tsx)?

Yes. The provider is wrapped around the app root in [src/app/_layout.tsx](src/app/_layout.tsx):

```tsx
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <Slot />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
```

## 7. Stub vs. real screens

Routes under `src/app/` and current status:

- `src/app/index.tsx` — fully implemented boot redirect screen
  - Renders a loading state while `AsyncStorage` values are read and then routes to onboarding or auth/tabs.

- `src/app/_layout.tsx` — fully implemented app shell/root layout
  - Contains `ThemeProvider`, `QueryClientProvider`, `GestureHandlerRootView`, and `BottomSheetModalProvider`.

- `src/app/+not-found.tsx` — fully implemented fallback screen
  - Handles unmatched routes.

- `src/app/(auth)/login.tsx` — fully implemented login UI and phone submit flow
  - Stores `herdos:authPhone` and `herdos:authName`, then routes based on `checkPhone()` response.

- `src/app/(auth)/verify-otp.tsx` — fully implemented OTP verification flow
  - Reads `herdos:authPhone`, collects OTP input, and verifies via `verifyOtp()`.

- `src/app/(tabs)/_layout.tsx` — tab layout shell
  - Present in the route tree; treated as a structural layout, not a placeholder screen.

- `src/app/(tabs)/alerts.tsx` — fully implemented alerts list/table view
  - Pulls alert data and renders alert rows.

- `src/app/(tabs)/herd.tsx` — fully implemented herd search/list screen
  - Supports search and filter chips.

- `src/app/(tabs)/index.tsx` — fully implemented home/dashboard screen
  - Shows summary, weather, recent alerts, recent activity.

- `src/app/(tabs)/map.tsx` — fully implemented map screen
  - Renders animals, farm, zones, draft zone creation/editing, and map-focused navigation.

- `src/app/(tabs)/settings.tsx` — fully implemented settings surface
  - Profile card, preferences, device status, about/privacy/version navigation.

- `src/app/animal/[id].tsx` — fully implemented animal detail screen
  - Displays hero card, vitals, map context, activity timeline, alert history, and action row.

- `src/app/animal/new.tsx` — stub/placeholder
  - Current render:

```tsx
export default function AddAnimalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Add Animal form — coming soon</ThemedText>
    </ThemedView>
  );
}
```

- `src/app/onboarding/index.tsx` — fully implemented onboarding welcome screen.
- `src/app/onboarding/geofence-intro.tsx` — fully implemented onboarding screen.
- `src/app/onboarding/illness-detection.tsx` — fully implemented onboarding screen.
- `src/app/onboarding/language-select.tsx` — fully implemented onboarding language selection screen.
- `src/app/onboarding/_layout.tsx` — onboarding layout shell.

- `src/app/settings/about.tsx` — placeholder-ish, not a full content page
  - Current render includes a TODO comment and a static text block:

```tsx
<ThemedText type="small">
  {/* TODO: Replace with the real app description copy. */}
  HERDOS helps farmers monitor livestock health, alerts, and device status in one place.
</ThemedText>
```

- `src/app/settings/device-diagnostics.tsx` — fully implemented diagnostics screen
  - Uses `useDeviceDiagnostics()` and renders battery/signal/last-sync cards.

- `src/app/settings/edit-profile.tsx` — fully implemented profile edit screen
  - Supports avatar selection via `expo-image-picker`, save profile, and current user state prefill.

- `src/app/settings/language.tsx` — fully implemented language selection screen
  - Uses `i18n.changeLanguage()` and updates preferences.

- `src/app/settings/privacy-policy.tsx` — placeholder-ish, not a full policy page
  - Current render includes several TODO comments and static placeholder copy.

- `src/app/zones/index.tsx` — fully implemented virtual fence management screen
  - Draws zones, toggles active state, lists danger zones.

## 8. Dependencies

From [package.json](package.json), the dependency list is:

```json
"dependencies": {
  "@expo/ui": "~57.0.8",
  "@gorhom/bottom-sheet": "^5.2.14",
  "@react-native-async-storage/async-storage": "^1.24.0",
  "@react-native-community/slider": "5.2.0",
  "@tanstack/react-query": "^5.101.4",
  "expo": "~57.0.9",
  "expo-constants": "~57.0.8",
  "expo-device": "~57.0.1",
  "expo-font": "~57.0.1",
  "expo-glass-effect": "~57.0.1",
  "expo-image": "~57.0.1",
  "expo-image-picker": "~57.0.7",
  "expo-linking": "~57.0.4",
  "expo-localization": "~15.0.0",
  "expo-router": "~57.0.9",
  "expo-splash-screen": "~57.0.5",
  "expo-status-bar": "~57.0.1",
  "expo-symbols": "~57.0.1",
  "expo-system-ui": "~57.0.2",
  "expo-web-browser": "~57.0.2",
  "i18next": "^23.16.8",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "react-i18next": "^14.1.3",
  "react-native": "0.86.2",
  "react-native-gesture-handler": "~2.32.0",
  "react-native-maps": "^1.29.0",
  "react-native-reanimated": "4.5.1",
  "react-native-safe-area-context": "~5.7.0",
  "react-native-screens": "~4.26.0",
  "react-native-web": "~0.21.0",
  "react-native-worklets": "0.10.1"
},
"devDependencies": {
  "@types/react": "~19.2.2",
  "typescript": "~6.0.3"
}
```

## 9. Anything else notable

- `src/services/api/settings.ts` is the only API module that bypasses the shared `client.ts` request wrapper for avatar upload. It uses a direct `fetch()` with `FormData` and does not attach the bearer token.
- `src/hooks/use-current-user.ts` is the only user-resolution hook actually used by the app; there is no global auth context provider.
- The login flow persists `herdos:authPhone`, `herdos:authName`, and `herdos:loggedIn`, but the source inspected never writes `herdos:authToken` during login/OTP verification.
- The app currently uses a hardcoded backend base URL fallback: `https://api.herdos.app`.
- There are still static placeholder comments in the About and Privacy Policy screens.
- The weather endpoint in [src/services/weather.ts](src/services/weather.ts) is an external Open-Meteo call and is not using the shared API client.
- The current map zone-editing code still uses the shared `GeofencePoint` type to represent polygon vertices, even though the old `farm.geofence` single-geofence concept is absent.

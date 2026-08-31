import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import { SUPPORTS_TERRAIN } from '@/constants/maps';
import type { MapType } from '@/types/map';

const STORAGE_KEY = 'herdos:mapType';

/** Terrain is Google-only, so a stored value can become invalid across platforms. */
function isUsable(value: string | null): value is MapType {
  if (value === 'satellite' || value === 'standard') return true;
  if (value === 'terrain') return SUPPORTS_TERRAIN;
  if (value === 'hybrid') return !SUPPORTS_TERRAIN;
  return false;
}

/**
 * The chosen base map, remembered across launches.
 *
 * A farmer who prefers Standard for drawing fences should not have to re-pick it
 * every time the app starts.
 */
export function useMapType() {
  const [mapType, setMapTypeState] = useState<MapType>('satellite');

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!cancelled && isUsable(stored)) setMapTypeState(stored);
      })
      .catch(() => {
        // A missing preference is not worth surfacing; satellite is a fine default.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setMapType = useCallback((next: MapType) => {
    setMapTypeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  return { mapType, setMapType };
}

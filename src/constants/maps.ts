import { Platform } from 'react-native';

/**
 * Map provider.
 *
 * Android-only Google Maps for now: a Google Maps API key can carry exactly one
 * application restriction (Android apps OR iOS apps, never both), so shipping a
 * single key means one platform would silently get a blank map. Until a separate
 * iOS key exists, iOS falls back to Apple Maps, which needs no key at all.
 *
 * To enable Google on iOS: create a second key restricted to iOS apps + the bundle
 * id, put it in app.json under ios.config.googleMapsApiKey, and return 'google'
 * unconditionally here.
 */
export const MAP_PROVIDER = Platform.OS === 'android' ? 'google' : undefined;

/**
 * react-native-maps only renders Heatmap through the Google provider, so the
 * grazing-density layer is unavailable wherever we fall back to Apple Maps.
 */
export const SUPPORTS_HEATMAP = MAP_PROVIDER === 'google';

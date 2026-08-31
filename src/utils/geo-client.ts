/** Client-side geometry helpers. The authoritative maths lives in the backend's lib/geo.js. */

const EARTH_RADIUS_M = 6371008.8;
const METERS_PER_DEG_LAT = (Math.PI * EARTH_RADIUS_M) / 180;

export function metersToLatDelta(meters: number) {
  return meters / METERS_PER_DEG_LAT;
}

export function metersToLngDelta(meters: number, atLat: number) {
  const perDeg = METERS_PER_DEG_LAT * Math.cos((atLat * Math.PI) / 180);
  // Guard the poles, where a metre spans an unbounded number of degrees.
  return perDeg < 1 ? 0 : meters / perDeg;
}

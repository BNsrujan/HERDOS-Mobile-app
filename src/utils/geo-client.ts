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

/** A closed polygon approximating a circle, for round water troughs. */
export function circlePolygon(center: { lat: number; lng: number }, radiusMeters: number, vertices = 12) {
  const points: { lat: number; lng: number }[] = [];
  for (let i = 0; i < vertices; i += 1) {
    const angle = (i / vertices) * Math.PI * 2;
    points.push({
      lat: center.lat + metersToLatDelta(radiusMeters) * Math.cos(angle),
      lng: center.lng + metersToLngDelta(radiusMeters, center.lat) * Math.sin(angle),
    });
  }
  return points;
}

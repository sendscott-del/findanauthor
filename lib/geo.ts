// Server-only geo helpers. Uses the offline `zipcodes` dataset — no external API.
import zipcodes from "zipcodes";

export interface LatLng {
  lat: number;
  lng: number;
}

const cityCache = new Map<string, LatLng | null>();

/** Approximate lat/lng for a US city + state (uses first ZIP centroid). */
export function geocodeCityState(city?: string, state?: string): LatLng | null {
  if (!city || !state) return null;
  const key = `${city.trim().toLowerCase()}|${state.trim().toUpperCase()}`;
  if (cityCache.has(key)) return cityCache.get(key)!;
  let result: LatLng | null = null;
  try {
    const matches = zipcodes.lookupByName(city.trim(), state.trim().toUpperCase());
    if (matches && matches.length) {
      // Average the centroids for a stable city-level point.
      const lat = matches.reduce((s, m) => s + (m.latitude || 0), 0) / matches.length;
      const lng = matches.reduce((s, m) => s + (m.longitude || 0), 0) / matches.length;
      if (lat && lng) result = { lat, lng };
    }
  } catch {
    result = null;
  }
  cityCache.set(key, result);
  return result;
}

/** Look up a US ZIP code. Returns coordinates + place name. */
export function geocodeZip(zip: string): (LatLng & { city: string; state: string }) | null {
  try {
    const z = zipcodes.lookup(zip.trim());
    if (z && z.latitude && z.longitude) {
      return { lat: z.latitude, lng: z.longitude, city: z.city, state: z.state };
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** Great-circle distance between two points, in miles. */
export function haversineMiles(a: LatLng, b: LatLng): number {
  const R = 3958.8; // Earth radius, miles
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

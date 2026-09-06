/**
 * Store network data for the hero map.
 *
 * ── HOW TO SWAP IN REAL DATA ────────────────────────────────────────────────
 * Replace the `STORE_LOCATIONS` array below with your real store list.
 * Only `lat` and `lng` are required; everything else is optional.
 * Coordinates are plain WGS84 decimal degrees (e.g. Bentonville: 36.3729, -94.2088).
 * Anything outside the Albers USA projection (most non-US points) is skipped.
 *
 * You can also load them at runtime instead, e.g.:
 *   const stores = await fetch("/api/stores").then(r => r.json());
 *   <UsStoreMap stores={stores} route={[...]} />
 * ────────────────────────────────────────────────────────────────────────────
 */

export type StoreLocation = {
  /** Stable identifier — store number works well */
  id: string;
  /** Display label shown on hover */
  name: string;
  lat: number;
  lng: number;
  /** Optional: drives dot size/emphasis */
  type?: "supercenter" | "neighborhood" | "dc";
};

/**
 * PLACEHOLDER SAMPLE DATA — representative US metro coordinates, not the real
 * store list. Swap this array for the actual roster when you have it.
 */
export const STORE_LOCATIONS: StoreLocation[] = [
  { id: "dc-bentonville", name: "Bentonville, AR", lat: 36.3729, lng: -94.2088, type: "dc" },
  { id: "dc-dallas", name: "Dallas, TX", lat: 32.7767, lng: -96.797, type: "dc" },
  { id: "dc-atlanta", name: "Atlanta, GA", lat: 33.749, lng: -84.388, type: "dc" },
  { id: "dc-chicago", name: "Chicago, IL", lat: 41.8781, lng: -87.6298, type: "dc" },
  { id: "dc-phoenix", name: "Phoenix, AZ", lat: 33.4484, lng: -112.074, type: "dc" },
  { id: "dc-harrisburg", name: "Harrisburg, PA", lat: 40.2732, lng: -76.8867, type: "dc" },

  { id: "s-seattle", name: "Seattle, WA", lat: 47.6062, lng: -122.3321 },
  { id: "s-portland", name: "Portland, OR", lat: 45.5152, lng: -122.6784 },
  { id: "s-boise", name: "Boise, ID", lat: 43.615, lng: -116.2023 },
  { id: "s-sacramento", name: "Sacramento, CA", lat: 38.5816, lng: -121.4944 },
  { id: "s-sanfran", name: "San Jose, CA", lat: 37.3382, lng: -121.8863 },
  { id: "s-losangeles", name: "Los Angeles, CA", lat: 34.0522, lng: -118.2437 },
  { id: "s-sandiego", name: "San Diego, CA", lat: 32.7157, lng: -117.1611 },
  { id: "s-lasvegas", name: "Las Vegas, NV", lat: 36.1699, lng: -115.1398 },
  { id: "s-saltlake", name: "Salt Lake City, UT", lat: 40.7608, lng: -111.891 },
  { id: "s-denver", name: "Denver, CO", lat: 39.7392, lng: -104.9903 },
  { id: "s-albuquerque", name: "Albuquerque, NM", lat: 35.0844, lng: -106.6504 },
  { id: "s-elpaso", name: "El Paso, TX", lat: 31.7619, lng: -106.485 },
  { id: "s-billings", name: "Billings, MT", lat: 45.7833, lng: -108.5007 },
  { id: "s-rapidcity", name: "Rapid City, SD", lat: 44.0805, lng: -103.231 },
  { id: "s-fargo", name: "Fargo, ND", lat: 46.8772, lng: -96.7898 },
  { id: "s-minneapolis", name: "Minneapolis, MN", lat: 44.9778, lng: -93.265 },
  { id: "s-omaha", name: "Omaha, NE", lat: 41.2565, lng: -95.9345 },
  { id: "s-kansascity", name: "Kansas City, MO", lat: 39.0997, lng: -94.5786 },
  { id: "s-wichita", name: "Wichita, KS", lat: 37.6872, lng: -97.3301 },
  { id: "s-oklahoma", name: "Oklahoma City, OK", lat: 35.4676, lng: -97.5164 },
  { id: "s-tulsa", name: "Tulsa, OK", lat: 36.154, lng: -95.9928 },
  { id: "s-desmoines", name: "Des Moines, IA", lat: 41.5868, lng: -93.625 },
  { id: "s-milwaukee", name: "Milwaukee, WI", lat: 43.0389, lng: -87.9065 },
  { id: "s-stlouis", name: "St. Louis, MO", lat: 38.627, lng: -90.1994 },
  { id: "s-indianapolis", name: "Indianapolis, IN", lat: 39.7684, lng: -86.1581 },
  { id: "s-detroit", name: "Detroit, MI", lat: 42.3314, lng: -83.0458 },
  { id: "s-columbus", name: "Columbus, OH", lat: 39.9612, lng: -82.9988 },
  { id: "s-louisville", name: "Louisville, KY", lat: 38.2527, lng: -85.7585 },
  { id: "s-nashville", name: "Nashville, TN", lat: 36.1627, lng: -86.7816 },
  { id: "s-memphis", name: "Memphis, TN", lat: 35.1495, lng: -90.049 },
  { id: "s-littlerock", name: "Little Rock, AR", lat: 34.7465, lng: -92.2896 },
  { id: "s-neworleans", name: "New Orleans, LA", lat: 29.9511, lng: -90.0715 },
  { id: "s-houston", name: "Houston, TX", lat: 29.7604, lng: -95.3698 },
  { id: "s-sanantonio", name: "San Antonio, TX", lat: 29.4241, lng: -98.4936 },
  { id: "s-austin", name: "Austin, TX", lat: 30.2672, lng: -97.7431 },
  { id: "s-birmingham", name: "Birmingham, AL", lat: 33.5186, lng: -86.8104 },
  { id: "s-jacksonville", name: "Jacksonville, FL", lat: 30.3322, lng: -81.6557 },
  { id: "s-orlando", name: "Orlando, FL", lat: 28.5383, lng: -81.3792 },
  { id: "s-miami", name: "Miami, FL", lat: 25.7617, lng: -80.1918 },
  { id: "s-tampa", name: "Tampa, FL", lat: 27.9506, lng: -82.4572 },
  { id: "s-charlotte", name: "Charlotte, NC", lat: 35.2271, lng: -80.8431 },
  { id: "s-raleigh", name: "Raleigh, NC", lat: 35.7796, lng: -78.6382 },
  { id: "s-charleston", name: "Charleston, SC", lat: 32.7765, lng: -79.9311 },
  { id: "s-richmond", name: "Richmond, VA", lat: 37.5407, lng: -77.436 },
  { id: "s-washington", name: "Washington, DC", lat: 38.9072, lng: -77.0369 },
  { id: "s-philadelphia", name: "Philadelphia, PA", lat: 39.9526, lng: -75.1652 },
  { id: "s-newyork", name: "New York, NY", lat: 40.7128, lng: -74.006 },
  { id: "s-boston", name: "Boston, MA", lat: 42.3601, lng: -71.0589 },
  { id: "s-buffalo", name: "Buffalo, NY", lat: 42.8864, lng: -78.8784 },
  { id: "s-pittsburgh", name: "Pittsburgh, PA", lat: 40.4406, lng: -79.9959 },
  { id: "s-portlandme", name: "Portland, ME", lat: 43.6591, lng: -70.2568 },
];

/**
 * Optional highlighted delivery route — a list of store `id`s, in order.
 * Swap for a real optimized tour when the routing agent is wired up.
 */
export const HIGHLIGHT_ROUTE: string[] = [
  "dc-bentonville",
  "s-tulsa",
  "s-kansascity",
  "s-desmoines",
  "s-minneapolis",
];

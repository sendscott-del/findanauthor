declare module "zipcodes" {
  export interface ZipEntry {
    zip: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
  }
  export function lookup(zip: string | number): ZipEntry | undefined;
  export function lookupByName(city: string, state: string): ZipEntry[];
  export function lookupByState(state: string): ZipEntry[];
  export function distance(zipA: string | number, zipB: string | number): number;
  export function radius(zip: string | number, miles: number): string[];
  const _default: {
    lookup: typeof lookup;
    lookupByName: typeof lookupByName;
    lookupByState: typeof lookupByState;
    distance: typeof distance;
    radius: typeof radius;
  };
  export default _default;
}

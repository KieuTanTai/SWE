/**
 * LocationDistrict Model for Frontend
 * Represents districts within cities
 */

import { LocationCity } from "./location-city";
import { LocationWard } from "./location-ward";
import { Address } from "./address";

export interface LocationDistrict {
  location_district_id: number;
  location_district_name: string;
  location_city_id: number;
  location_district_status: boolean;

  // Navigation Properties
  city?: LocationCity | null; // LocationCity object
  wards?: LocationWard[]; // Array of LocationWard objects
  addresses?: Address[]; // Array of Address objects
}

export interface CreateLocationDistrictDTO {
  location_district_name: string;
  location_city_id: number;
}

export interface UpdateLocationDistrictDTO {
  location_district_name?: string;
  location_city_id?: number;
  location_district_status?: boolean;
}

export function createDefaultLocationDistrict(
  overrides?: Partial<LocationDistrict>
): LocationDistrict {
  return {
    location_district_id: 0,
    location_district_name: "",
    location_city_id: 0,
    location_district_status: true,
    city: null,
    wards: [],
    addresses: [],
    ...overrides,
  };
}

export default LocationDistrict;

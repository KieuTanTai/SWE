/**
 * LocationCity Model for Frontend
 * Represents cities in the location hierarchy
 */

import { LocationDistrict } from "./location-district";
import { Address } from "./address";

export interface LocationCity {
  location_city_id: number;
  location_city_name: string;
  location_city_status: boolean;

  // Navigation Properties
  districts?: LocationDistrict[]; // Array of LocationDistrict objects
  addresses?: Address[]; // Array of Address objects
}

export interface CreateLocationCityDTO {
  location_city_name: string;
}

export interface UpdateLocationCityDTO {
  location_city_name?: string;
  location_city_status?: boolean;
}

export function createDefaultLocationCity(
  overrides?: Partial<LocationCity>
): LocationCity {
  return {
    location_city_id: 0,
    location_city_name: "",
    location_city_status: true,
    districts: [],
    addresses: [],
    ...overrides,
  };
}

export default LocationCity;

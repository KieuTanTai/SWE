/**
 * Address Model for Frontend
 * Represents complete addresses using location hierarchy
 */

import { LocationCity } from "./location-city";
import { LocationDistrict } from "./location-district";
import { LocationWard } from "./location-ward";
import { Parent } from "./parent";
import { DetailRoute } from "./detail-route";

export interface Address {
  address_id: number;
  address_city_id: number;
  address_district_id: number;
  address_ward_id: number;
  address_number: string;

  // Navigation Properties
  city?: LocationCity | null; // LocationCity object
  district?: LocationDistrict | null; // LocationDistrict object
  ward?: LocationWard | null; // LocationWard object
  parents?: Parent[]; // Array of Parent objects using this address
  routeStartPoints?: DetailRoute[]; // Array of DetailRoute objects where this is start point
  routeEndPoints?: DetailRoute[]; // Array of DetailRoute objects where this is end point

  // Computed property
  full_address?: string;
}

export interface CreateAddressDTO {
  address_city_id: number;
  address_district_id: number;
  address_ward_id: number;
  address_number: string;
}

export interface UpdateAddressDTO {
  address_city_id?: number;
  address_district_id?: number;
  address_ward_id?: number;
  address_number?: string;
}

export function createDefaultAddress(overrides?: Partial<Address>): Address {
  return {
    address_id: 0,
    address_city_id: 0,
    address_district_id: 0,
    address_ward_id: 0,
    address_number: "",
    city: null,
    district: null,
    ward: null,
    parents: [],
    routeStartPoints: [],
    routeEndPoints: [],
    ...overrides,
  };
}

export default Address;

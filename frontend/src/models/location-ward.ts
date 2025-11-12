/**
 * LocationWard Model for Frontend
 * Represents wards within districts
 */

import { LocationDistrict } from './location-district';
import { Address } from './address';

export interface LocationWard {
  location_ward_id: number;
  location_ward_name: string;
  location_district_id: number;
  location_ward_status: boolean;

  // Navigation Properties
  district?: LocationDistrict | null; // LocationDistrict object
  addresses?: Address[]; // Array of Address objects
}

export interface CreateLocationWardDTO {
  location_ward_name: string;
  location_district_id: number;
}

export interface UpdateLocationWardDTO {
  location_ward_name?: string;
  location_district_id?: number;
  location_ward_status?: boolean;
}

export default LocationWard;

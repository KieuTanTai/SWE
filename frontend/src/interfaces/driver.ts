/**
 * Driver Model for Frontend
 * Represents drivers in the system
 */

import { Person } from './person';
import { Schedule } from './schedule';
import { Report } from './report';

export type DriverExperienceType = 'day' | 'month' | 'year';

export interface Driver {
  driver_person_id: number;
  driver_experience: number;
  driver_experience_type: DriverExperienceType;
  driver_late_arrival_count: number;

  // Navigation Properties
  person?: Person | null; // Person object (must have person_type = 'driver')
  schedules?: Schedule[]; // Array of Schedule objects
  reports?: Report[]; // Array of Report objects

  // Computed property
  experience_in_years?: number;
}

export interface CreateDriverDTO {
  driver_person_id: number;
  driver_experience: number;
  driver_experience_type: DriverExperienceType;
}

export interface UpdateDriverDTO {
  driver_experience?: number;
  driver_experience_type?: DriverExperienceType;
  driver_late_arrival_count?: number;
}

export default Driver;

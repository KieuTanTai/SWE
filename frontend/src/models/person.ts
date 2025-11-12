/**
 * Person Model for Frontend
 * Base model for all persons in the system (manager, driver, parent, student, other)
 */

import { Account } from './account';
import { Parent } from './parent';
import { Driver } from './driver';
import { Student } from './student';
import { Schedule } from './schedule';

export type PersonType = 'manager' | 'driver' | 'parent' | 'student' | 'other';

export interface Person {
  person_id: number;
  person_account_id?: number | null;
  person_phone: string;
  person_name: string;
  person_gender: boolean; // true = male, false = female
  person_birthday: Date | string;
  person_type: PersonType;
  person_life_cycle_status: boolean;

  // Navigation Properties
  account?: Account | null; // Account object
  parentProfile?: Parent | null; // Parent object if person_type is 'parent'
  driverProfile?: Driver | null; // Driver object if person_type is 'driver'
  studentProfile?: Student | null; // Student object if person_type is 'student'
  managedSchedules?: Schedule[]; // Array of Schedule objects where this person is manager
}

export interface CreatePersonDTO {
  person_account_id?: number | null;
  person_phone: string;
  person_name: string;
  person_gender: boolean;
  person_birthday: Date | string;
  person_type: PersonType;
}

export interface UpdatePersonDTO {
  person_phone?: string;
  person_name?: string;
  person_gender?: boolean;
  person_birthday?: Date | string;
  person_type?: PersonType;
  person_life_cycle_status?: boolean;
}

export default Person;

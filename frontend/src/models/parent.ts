/**
 * Parent Model for Frontend
 * Represents parents in the system
 */

import { Person } from './person';
import { Address } from './address';
import { Student } from './student';

export type ParentType = 'father' | 'mother' | 'grandpa' | 'grandma' | 'other';

export interface Parent {
  parent_person_id: number;
  parent_address_id?: number | null;
  parent_job: string;
  parent_type: ParentType;

  // Navigation Properties
  person?: Person | null; // Person object (must have person_type = 'parent')
  address?: Address | null; // Address object
  students?: Student[]; // Array of Student objects (children)
}

export interface CreateParentDTO {
  parent_person_id: number;
  parent_address_id?: number | null;
  parent_job: string;
  parent_type: ParentType;
}

export interface UpdateParentDTO {
  parent_address_id?: number | null;
  parent_job?: string;
  parent_type?: ParentType;
}

export default Parent;

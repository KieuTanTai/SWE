/**
 * Student Model for Frontend
 * Represents students in the system
 */

import { Person } from "./person";
import { Parent } from "./parent";
import { PickupSchedule } from "./pickup-schedule";

export interface Student {
  student_id: number;
  student_parent_id: number;
  student_person_id: number;
  student_grade?: number | null;

  // Navigation Properties
  person?: Person | null; // Person object (must have person_type = 'student')
  parent?: Parent | null; // Parent object
  pickupSchedules?: PickupSchedule[]; // Array of PickupSchedule objects
}

export interface CreateStudentDTO {
  student_parent_id: number;
  student_person_id: number;
  student_grade?: number | null;
}

export interface UpdateStudentDTO {
  student_parent_id?: number;
  student_grade?: number | null;
}

export function createDefaultStudent(overrides?: Partial<Student>): Student {
  return {
    student_id: 0,
    student_parent_id: 0,
    student_person_id: 0,
    student_grade: null,
    person: null,
    parent: null,
    pickupSchedules: [],
    ...overrides,
  };
}

export default Student;

/**
 * Report Model for Frontend
 * Represents driver reports for various activities
 */

import { Driver } from "./driver";

export type ReportType =
  | "start_pickup"
  | "picked_up"
  | "late"
  | "dropped_off"
  | "warning";

export interface Report {
  report_id: number;
  report_driver_id: number;
  report_time: Date | string;
  report_type: ReportType;
  report_content: string;

  // Navigation Properties
  driver?: Driver | null; // Driver object

  // Computed property
  formatted_time?: string;
}

export interface CreateReportDTO {
  report_driver_id: number;
  report_type: ReportType;
  report_content: string;
}

export interface UpdateReportDTO {
  report_type?: ReportType;
  report_content?: string;
}

export function createDefaultReport(overrides?: Partial<Report>): Report {
  return {
    report_id: 0,
    report_driver_id: 0,
    report_time: new Date().toISOString(),
    report_type: "start_pickup",
    report_content: "",
    driver: null,
    ...overrides,
  };
}

export default Report;

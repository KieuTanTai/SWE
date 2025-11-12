/**
 * Central export file for all models
 * Import models from this file for consistency
 */

// Account & Role
export * from './account';
export * from './role';
export * from './account-role';

// Person & Related
export * from './person';
export * from './driver';
export * from './parent';
export * from './student';

// Location & Address
export * from './location-city';
export * from './location-district';
export * from './location-ward';
export * from './address';

// Bus & Route
export * from './bus';
export * from './route';
export * from './detail-route';
export * from './bus-route';

// Schedule
export * from './schedule';
export * from './detail-schedule';
export * from './time-role';
export * from './pickup-schedule';

// Report
export * from './report';

// Default type exports for convenience
import type Account from './account';
import type Role from './role';
import type AccountRole from './account-role';
import type Person from './person';
import type Driver from './driver';
import type Parent from './parent';
import type Student from './student';
import type LocationCity from './location-city';
import type LocationDistrict from './location-district';
import type LocationWard from './location-ward';
import type Address from './address';
import type Bus from './bus';
import type Route from './route';
import type DetailRoute from './detail-route';
import type BusRoute from './bus-route';
import type Schedule from './schedule';
import type DetailSchedule from './detail-schedule';
import type TimeRole from './time-role';
import type PickupSchedule from './pickup-schedule';
import type Report from './report';

export type {
  Account,
  Role,
  AccountRole,
  Person,
  Driver,
  Parent,
  Student,
  LocationCity,
  LocationDistrict,
  LocationWard,
  Address,
  Bus,
  Route,
  DetailRoute,
  BusRoute,
  Schedule,
  DetailSchedule,
  TimeRole,
  PickupSchedule,
  Report,
};

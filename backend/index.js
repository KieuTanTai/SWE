/**
 * Models Index
 * Central export file for all models
 */

// Authentication & Authorization Models
import Account from './models/Account.js';
import Role from './models/Role.js';
import AccountRole from './models/AccountRole.js';

// Location Models
import LocationCity from './models/LocationCity.js';
import LocationDistrict from './models/LocationDistrict.js';
import LocationWard from './models/LocationWard.js';
import Address from './models/Address.js';

// Person & Related Models
import Person from './models/Person.js';
import Parent from './models/Parent.js';
import Driver from './models/Driver.js';
import Student from './models/Student.js';

// Transportation Models
import Route from './models/Route.js';
import DetailRoute from './models/DetailRoute.js';
import Bus from './models/Bus.js';
import BusRoute from './models/BusRoute.js';

// Scheduling Models
import TimeRole from './models/TimeRole.js';
import Schedule from './models/Schedule.js';
import DetailSchedule from './models/DetailSchedule.js';
import PickupSchedule from './models/PickupSchedule.js';

// Reporting Models
import Report from './models/Report.js';

export {
    // Authentication & Authorization
    Account,
    Role,
    AccountRole,

    // Location
    LocationCity,
    LocationDistrict,
    LocationWard,
    Address,

    // Person & Related
    Person,
    Parent,
    Driver,
    Student,

    // Transportation
    Route,
    DetailRoute,
    Bus,
    BusRoute,

    // Scheduling
    TimeRole,
    Schedule,
    DetailSchedule,
    PickupSchedule,

    // Reporting
    Report
};
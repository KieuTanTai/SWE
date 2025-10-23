/**
 * Models Index
 * Central export file for all models
 */

// Authentication & Authorization Models
import Account from './Account.js';
import Role from './Role.js';
import AccountRole from './AccountRole.js';

// Location Models
import LocationCity from './LocationCity.js';
import LocationDistrict from './LocationDistrict.js';
import LocationWard from './LocationWard.js';
import Address from './Address.js';

// Person & Related Models
import Person from './Person.js';
import Parent from './Parent.js';
import Driver from './Driver.js';
import Student from './Student.js';

// Transportation Models
import Route from './Route.js';
import DetailRoute from './DetailRoute.js';
import Bus from './Bus.js';
import BusRoute from './BusRoute.js';

// Scheduling Models
import TimeRole from './TimeRole.js';
import Schedule from './Schedule.js';
import DetailSchedule from './DetailSchedule.js';
import PickupSchedule from './PickupSchedule.js';

// Reporting Models
import Report from './Report.js';

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
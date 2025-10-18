/**
 * Models Index
 * Central export file for all models
 */

// Authentication & Authorization Models
const Account = require('./Account');
const Role = require('./Role');
const AccountRole = require('./AccountRole');

// Location Models
const LocationCity = require('./LocationCity');
const LocationDistrict = require('./LocationDistrict');
const LocationWard = require('./LocationWard');
const Address = require('./Address');

// Person & Related Models
const Person = require('./Person');
const Parent = require('./Parent');
const Driver = require('./Driver');
const Student = require('./Student');

// Transportation Models
const Route = require('./Route').default;
const DetailRoute = require('./DetailRoute');
const Bus = require('./Bus');
const BusRoute = require('./BusRoute');

// Scheduling Models
const TimeRole = require('./TimeRole');
const Schedule = require('./Schedule');
const DetailSchedule = require('./DetailSchedule');
const PickupSchedule = require('./PickupSchedule');

// Reporting Models
const Report = require('./Report');

module.exports = {
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
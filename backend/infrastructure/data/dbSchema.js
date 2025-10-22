/**
 * Database Schema Constants
 * Auto-generated from SSB_System.sql
 * Contains all table names, column names, and constraints for DAO usage
 * 
 * @module dbSchema
 * @description Database schema definitions for SSB (School Bus System)
 */

// ============================================================================
// SCHEMA
// ============================================================================

export const SCHEMA = {
    NAME: 'SSB'
};

// ============================================================================
// TABLES
// ============================================================================

export const TABLES = {
    ACCOUNT: 'Account',
    ROLE: 'Role',
    ACCOUNT_ROLE: 'Account_Role',
    LOCATION_CITY: 'Location_City',
    LOCATION_DISTRICT: 'Location_District',
    LOCATION_WARD: 'Location_Ward',
    ADDRESS: 'Address',
    ROUTE: 'Route',
    DETAIL_ROUTE: 'Detail_Route',
    PERSON: 'Person',
    PARENT: 'Parent',
    DRIVER: 'Driver',
    STUDENT: 'Student',
    TIME_ROLE: 'Time_Role',
    SCHEDULE: 'Schedule',
    PICKUP_SCHEDULE: 'Pickup_Schedule',
    DETAIL_SCHEDULE: 'Detail_Schedule',
    BUS: 'Bus',
    BUS_ROUTE: 'Bus_Route',
    REPORT: 'Report'
};

// ============================================================================
// COLUMNS
// ============================================================================

/**
 * Account table columns
 */
export const ACCOUNT_COLUMNS = {
    ACCOUNT_ID: 'account_id',
    ACCOUNT_EMAIL: 'account_email',
    ACCOUNT_PASSWORD: 'account_password',
    ACCOUNT_CREATE_DATE: 'account_create_date',
    ACCOUNT_LAST_UPDATED_DATE: 'account_last_updated_date',
    ACCOUNT_LOGIN_STATUS: 'account_login_status'
};

/**
 * Role table columns
 */
export const ROLE_COLUMNS = {
    ROLE_ID: 'role_id',
    ROLE_NAME: 'role_name',
    ROLE_CREATED_DATE: 'role_created_date',
    ROLE_ACTIVE_STATUS: 'role_active_status'
};

/**
 * Account_Role table columns (Junction table)
 */
export const ACCOUNT_ROLE_COLUMNS = {
    ROLE_ID: 'role_id',
    ACCOUNT_ID: 'account_id'
};

/**
 * Location_City table columns
 */
export const LOCATION_CITY_COLUMNS = {
    LOCATION_CITY_ID: 'location_city_id',
    LOCATION_CITY_NAME: 'location_city_name',
    LOCATION_CITY_STATUS: 'location_city_status'
};

/**
 * Location_District table columns
 */
export const LOCATION_DISTRICT_COLUMNS = {
    LOCATION_DISTRICT_ID: 'location_district_id',
    LOCATION_DISTRICT_NAME: 'location_district_name',
    LOCATION_CITY_ID: 'location_city_id',
    LOCATION_DISTRICT_STATUS: 'location_district_status'
};

/**
 * Location_Ward table columns
 */
export const LOCATION_WARD_COLUMNS = {
    LOCATION_WARD_ID: 'location_ward_id',
    LOCATION_WARD_NAME: 'location_ward_name',
    LOCATION_DISTRICT_ID: 'location_district_id',
    LOCATION_WARD_STATUS: 'location_ward_status'
};

/**
 * Address table columns
 */
export const ADDRESS_COLUMNS = {
    ADDRESS_ID: 'address_id',
    ADDRESS_CITY_ID: 'address_city_id',
    ADDRESS_DISTRICT_ID: 'address_district_id',
    ADDRESS_WARD_ID: 'address_ward_id',
    ADDRESS_NUMBER: 'address_number'
};

/**
 * Route table columns
 */
export const ROUTE_COLUMNS = {
    ROUTE_ID: 'route_id',
    ROUTE_NAME: 'route_name',
    ROUTE_STATUS: 'route_status'
};

/**
 * Detail_Route table columns
 */
export const DETAIL_ROUTE_COLUMNS = {
    DETAIL_ROUTE_ID: 'detail_route_id',
    ROUTE_ID: 'route_id',
    DETAIL_ROUTE_START_POINT_ID: 'detail_route_start_point_id',
    DETAIL_ROUTE_END_POINT_ID: 'detail_route_end_point_id',
    DETAIL_ROUTE_DISTANCE: 'detail_route_distance'
};

/**
 * Person table columns
 */
export const PERSON_COLUMNS = {
    PERSON_ID: 'person_id',
    PERSON_ACCOUNT_ID: 'person_account_id',
    PERSON_PHONE: 'person_phone',
    PERSON_NAME: 'person_name',
    PERSON_GENDER: 'person_gender',
    PERSON_BIRTHDAY: 'person_birthday',
    PERSON_TYPE: 'person_type',
    PERSON_LIFE_CYCLE_STATUS: 'person_life_cycle_status'
};

/**
 * Parent table columns
 */
export const PARENT_COLUMNS = {
    PARENT_PERSON_ID: 'parent_person_id',
    PARENT_ADDRESS_ID: 'parent_address_id',
    PARENT_JOB: 'parent_job',
    PARENT_TYPE: 'parent_type'
};

/**
 * Driver table columns
 */
export const DRIVER_COLUMNS = {
    DRIVER_PERSON_ID: 'driver_person_id',
    DRIVER_EXPERIENCE: 'driver_experience',
    DRIVER_EXPERIENCE_TYPE: 'driver_experience_type',
    DRIVER_LATE_ARRIVAL_COUNT: 'driver_late_arrival_count'
};

/**
 * Student table columns
 */
export const STUDENT_COLUMNS = {
    STUDENT_ID: 'student_id',
    STUDENT_PARENT_ID: 'student_parent_id',
    STUDENT_PERSON_ID: 'student_person_id',
    STUDENT_GRADE: 'student_grade'
};

/**
 * Time_Role table columns
 */
export const TIME_ROLE_COLUMNS = {
    TIME_ROLE_ID: 'time_role_id',
    TIME_ROLE_START_PICKUP_TIME: 'time_role_start_pickup_time',
    TIME_ROLE_START_DROP_OFF_TIME: 'time_role_start_drop_off_time',
    TIME_ROLE_STATUS: 'time_role_status'
};

/**
 * Schedule table columns
 */
export const SCHEDULE_COLUMNS = {
    SCHEDULE_ID: 'schedule_id',
    SCHEDULE_BY_MANAGER_ID: 'schedule_by_manager_id',
    SCHEDULE_DRIVER_ID: 'schedule_driver_id',
    SCHEDULE_START_DATE: 'schedule_start_date',
    SCHEDULE_END_DATE: 'schedule_end_date',
    SCHEDULE_STATUS: 'schedule_status'
};

/**
 * Pickup_Schedule table columns
 */
export const PICKUP_SCHEDULE_COLUMNS = {
    PICKUP_SCHEDULE_ID: 'pickup_schedule_id',
    PICKUP_SCHEDULE_DETAIL_ID: 'pickup_schedule_detail_id',
    PICKUP_SCHEDULE_STUDENT_ID: 'pickup_schedule_student_id'
};

/**
 * Detail_Schedule table columns
 */
export const DETAIL_SCHEDULE_COLUMNS = {
    DETAIL_SCHEDULE_ID: 'detail_schedule_id',
    SCHEDULE_ID: 'schedule_id',
    DETAIL_SCHEDULE_BUS_ROUTE_ID: 'detail_schedule_bus_route_id',
    DETAIL_SCHEDULE_TIME_ROLE_ID: 'detail_schedule_time_role_id'
};

/**
 * Bus table columns
 */
export const BUS_COLUMNS = {
    BUS_ID: 'bus_id',
    BUS_LICENSE_PLATE: 'bus_license_plate',
    BUS_BRAND: 'bus_brand',
    BUS_MODEL: 'bus_model',
    BUS_CAPACITY: 'bus_capacity',
    BUS_YEAR_MANUFACTURED: 'bus_year_manufactured',
    BUS_HAS_WIFI: 'bus_has_wifi',
    BUS_HAS_CAMERA: 'bus_has_camera',
    BUS_COLOR: 'bus_color',
    BUS_STATUS: 'bus_status'
};

/**
 * Bus_Route table columns
 */
export const BUS_ROUTE_COLUMNS = {
    BUS_ROUTE_ID: 'bus_route_id',
    ROUTE_ID: 'route_id',
    BUS_ID: 'bus_id',
    BUS_ROUTE_STATUS: 'bus_route_status'
};

/**
 * Report table columns
 */
export const REPORT_COLUMNS = {
    REPORT_ID: 'report_id',
    REPORT_DRIVER_ID: 'report_driver_id',
    REPORT_TIME: 'report_time',
    REPORT_TYPE: 'report_type',
    REPORT_CONTENT: 'report_content'
};

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Person type enum values
 */
export const PERSON_TYPE = {
    MANAGER: 'manager',
    DRIVER: 'driver',
    PARENT: 'parent',
    STUDENT: 'student',
    OTHER: 'other'
};

/**
 * Parent type enum values
 */
export const PARENT_TYPE = {
    FATHER: 'father',
    MOTHER: 'mother',
    GRANDPA: 'grandpa',
    GRANDMA: 'grandma',
    OTHER: 'other'
};

/**
 * Driver experience type enum values
 */
export const DRIVER_EXPERIENCE_TYPE = {
    DAY: 'day',
    MONTH: 'month',
    YEAR: 'year'
};

/**
 * Report type enum values
 */
export const REPORT_TYPE = {
    START_PICKUP: 'start_pickup',
    PICKED_UP: 'picked_up',
    LATE: 'late',
    DROPPED_OFF: 'dropped_off',
    WARNING: 'warning'
};

// ============================================================================
// PRIMARY KEYS
// ============================================================================

export const PRIMARY_KEYS = {
    ACCOUNT: ACCOUNT_COLUMNS.ACCOUNT_ID,
    ROLE: ROLE_COLUMNS.ROLE_ID,
    ACCOUNT_ROLE: [ACCOUNT_ROLE_COLUMNS.ROLE_ID, ACCOUNT_ROLE_COLUMNS.ACCOUNT_ID],
    LOCATION_CITY: LOCATION_CITY_COLUMNS.LOCATION_CITY_ID,
    LOCATION_DISTRICT: LOCATION_DISTRICT_COLUMNS.LOCATION_DISTRICT_ID,
    LOCATION_WARD: LOCATION_WARD_COLUMNS.LOCATION_WARD_ID,
    ADDRESS: ADDRESS_COLUMNS.ADDRESS_ID,
    ROUTE: ROUTE_COLUMNS.ROUTE_ID,
    DETAIL_ROUTE: DETAIL_ROUTE_COLUMNS.DETAIL_ROUTE_ID,
    PERSON: PERSON_COLUMNS.PERSON_ID,
    PARENT: PARENT_COLUMNS.PARENT_PERSON_ID,
    DRIVER: DRIVER_COLUMNS.DRIVER_PERSON_ID,
    STUDENT: STUDENT_COLUMNS.STUDENT_ID,
    TIME_ROLE: TIME_ROLE_COLUMNS.TIME_ROLE_ID,
    SCHEDULE: SCHEDULE_COLUMNS.SCHEDULE_ID,
    PICKUP_SCHEDULE: PICKUP_SCHEDULE_COLUMNS.PICKUP_SCHEDULE_ID,
    DETAIL_SCHEDULE: DETAIL_SCHEDULE_COLUMNS.DETAIL_SCHEDULE_ID,
    BUS: BUS_COLUMNS.BUS_ID,
    BUS_ROUTE: BUS_ROUTE_COLUMNS.BUS_ROUTE_ID,
    REPORT: REPORT_COLUMNS.REPORT_ID
};

// ============================================================================
// FOREIGN KEYS
// ============================================================================

export const FOREIGN_KEYS = {
    ACCOUNT_ROLE: {
        ACCOUNT_ID: {
            table: TABLES.ACCOUNT,
            column: ACCOUNT_COLUMNS.ACCOUNT_ID,
            onDelete: 'CASCADE'
        },
        ROLE_ID: {
            table: TABLES.ROLE,
            column: ROLE_COLUMNS.ROLE_ID,
            onDelete: 'CASCADE'
        }
    },
    LOCATION_DISTRICT: {
        LOCATION_CITY_ID: {
            table: TABLES.LOCATION_CITY,
            column: LOCATION_CITY_COLUMNS.LOCATION_CITY_ID
        }
    },
    LOCATION_WARD: {
        LOCATION_DISTRICT_ID: {
            table: TABLES.LOCATION_DISTRICT,
            column: LOCATION_DISTRICT_COLUMNS.LOCATION_DISTRICT_ID
        }
    },
    ADDRESS: {
        ADDRESS_CITY_ID: {
            table: TABLES.LOCATION_CITY,
            column: LOCATION_CITY_COLUMNS.LOCATION_CITY_ID
        },
        ADDRESS_DISTRICT_ID: {
            table: TABLES.LOCATION_DISTRICT,
            column: LOCATION_DISTRICT_COLUMNS.LOCATION_DISTRICT_ID
        },
        ADDRESS_WARD_ID: {
            table: TABLES.LOCATION_WARD,
            column: LOCATION_WARD_COLUMNS.LOCATION_WARD_ID
        }
    },
    PERSON: {
        PERSON_ACCOUNT_ID: {
            table: TABLES.ACCOUNT,
            column: ACCOUNT_COLUMNS.ACCOUNT_ID
        }
    },
    PARENT: {
        PARENT_PERSON_ID: {
            table: TABLES.PERSON,
            column: PERSON_COLUMNS.PERSON_ID
        },
        PARENT_ADDRESS_ID: {
            table: TABLES.ADDRESS,
            column: ADDRESS_COLUMNS.ADDRESS_ID
        }
    },
    DRIVER: {
        DRIVER_PERSON_ID: {
            table: TABLES.PERSON,
            column: PERSON_COLUMNS.PERSON_ID
        }
    },
    STUDENT: {
        STUDENT_PERSON_ID: {
            table: TABLES.PERSON,
            column: PERSON_COLUMNS.PERSON_ID
        },
        STUDENT_PARENT_ID: {
            table: TABLES.PARENT,
            column: PARENT_COLUMNS.PARENT_PERSON_ID
        }
    },
    DETAIL_ROUTE: {
        ROUTE_ID: {
            table: TABLES.ROUTE,
            column: ROUTE_COLUMNS.ROUTE_ID
        },
        DETAIL_ROUTE_START_POINT_ID: {
            table: TABLES.ADDRESS,
            column: ADDRESS_COLUMNS.ADDRESS_ID
        },
        DETAIL_ROUTE_END_POINT_ID: {
            table: TABLES.ADDRESS,
            column: ADDRESS_COLUMNS.ADDRESS_ID
        }
    },
    SCHEDULE: {
        SCHEDULE_BY_MANAGER_ID: {
            table: TABLES.PERSON,
            column: PERSON_COLUMNS.PERSON_ID
        },
        SCHEDULE_DRIVER_ID: {
            table: TABLES.DRIVER,
            column: DRIVER_COLUMNS.DRIVER_PERSON_ID
        }
    },
    DETAIL_SCHEDULE: {
        SCHEDULE_ID: {
            table: TABLES.SCHEDULE,
            column: SCHEDULE_COLUMNS.SCHEDULE_ID
        },
        DETAIL_SCHEDULE_TIME_ROLE_ID: {
            table: TABLES.TIME_ROLE,
            column: TIME_ROLE_COLUMNS.TIME_ROLE_ID
        },
        DETAIL_SCHEDULE_BUS_ROUTE_ID: {
            table: TABLES.BUS_ROUTE,
            column: BUS_ROUTE_COLUMNS.BUS_ROUTE_ID
        }
    },
    BUS_ROUTE: {
        ROUTE_ID: {
            table: TABLES.ROUTE,
            column: ROUTE_COLUMNS.ROUTE_ID
        },
        BUS_ID: {
            table: TABLES.BUS,
            column: BUS_COLUMNS.BUS_ID
        }
    },
    REPORT: {
        REPORT_DRIVER_ID: {
            table: TABLES.DRIVER,
            column: DRIVER_COLUMNS.DRIVER_PERSON_ID
        }
    },
    PICKUP_SCHEDULE: {
        PICKUP_SCHEDULE_DETAIL_ID: {
            table: TABLES.DETAIL_SCHEDULE,
            column: DETAIL_SCHEDULE_COLUMNS.DETAIL_SCHEDULE_ID
        },
        PICKUP_SCHEDULE_STUDENT_ID: {
            table: TABLES.STUDENT,
            column: STUDENT_COLUMNS.STUDENT_ID
        }
    }
};

// ============================================================================
// UNIQUE CONSTRAINTS
// ============================================================================

export const UNIQUE_CONSTRAINTS = {
    ACCOUNT: [ACCOUNT_COLUMNS.ACCOUNT_EMAIL],
    BUS: [BUS_COLUMNS.BUS_LICENSE_PLATE],
    PERSON: [PERSON_COLUMNS.PERSON_ACCOUNT_ID],
    STUDENT: [STUDENT_COLUMNS.STUDENT_PERSON_ID]
};

// ============================================================================
// DEFAULT VALUES
// ============================================================================

export const DEFAULT_VALUES = {
    ACCOUNT: {
        ACCOUNT_LOGIN_STATUS: false
    },
    ROLE: {
        ROLE_ACTIVE_STATUS: true
    },
    LOCATION_CITY: {
        LOCATION_CITY_STATUS: true
    },
    LOCATION_DISTRICT: {
        LOCATION_DISTRICT_STATUS: true
    },
    LOCATION_WARD: {
        LOCATION_WARD_STATUS: true
    },
    ROUTE: {
        ROUTE_STATUS: true
    },
    PERSON: {
        PERSON_LIFE_CYCLE_STATUS: true
    },
    DRIVER: {
        DRIVER_EXPERIENCE: 0,
        DRIVER_EXPERIENCE_TYPE: DRIVER_EXPERIENCE_TYPE.YEAR,
        DRIVER_LATE_ARRIVAL_COUNT: 0
    },
    TIME_ROLE: {
        TIME_ROLE_STATUS: true
    },
    SCHEDULE: {
        SCHEDULE_STATUS: true
    },
    BUS: {
        BUS_HAS_WIFI: false,
        BUS_HAS_CAMERA: false,
        BUS_STATUS: true
    },
    BUS_ROUTE: {
        BUS_ROUTE_STATUS: true
    }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all columns for a specific table
 * @param {string} tableName - Table name from TABLES constant
 * @returns {Object} Object containing all column names
 */
export function getTableColumns(tableName) {
    const columnMap = {
        [TABLES.ACCOUNT]: ACCOUNT_COLUMNS,
        [TABLES.ROLE]: ROLE_COLUMNS,
        [TABLES.ACCOUNT_ROLE]: ACCOUNT_ROLE_COLUMNS,
        [TABLES.LOCATION_CITY]: LOCATION_CITY_COLUMNS,
        [TABLES.LOCATION_DISTRICT]: LOCATION_DISTRICT_COLUMNS,
        [TABLES.LOCATION_WARD]: LOCATION_WARD_COLUMNS,
        [TABLES.ADDRESS]: ADDRESS_COLUMNS,
        [TABLES.ROUTE]: ROUTE_COLUMNS,
        [TABLES.DETAIL_ROUTE]: DETAIL_ROUTE_COLUMNS,
        [TABLES.PERSON]: PERSON_COLUMNS,
        [TABLES.PARENT]: PARENT_COLUMNS,
        [TABLES.DRIVER]: DRIVER_COLUMNS,
        [TABLES.STUDENT]: STUDENT_COLUMNS,
        [TABLES.TIME_ROLE]: TIME_ROLE_COLUMNS,
        [TABLES.SCHEDULE]: SCHEDULE_COLUMNS,
        [TABLES.PICKUP_SCHEDULE]: PICKUP_SCHEDULE_COLUMNS,
        [TABLES.DETAIL_SCHEDULE]: DETAIL_SCHEDULE_COLUMNS,
        [TABLES.BUS]: BUS_COLUMNS,
        [TABLES.BUS_ROUTE]: BUS_ROUTE_COLUMNS,
        [TABLES.REPORT]: REPORT_COLUMNS
    };
    return columnMap[tableName] || null;
}

/**
 * Get column names as array for a specific table
 * @param {string} tableName - Table name from TABLES constant
 * @returns {Array<string>} Array of column names
 */
export function getTableColumnNames(tableName) {
    const columns = getTableColumns(tableName);
    return columns ? Object.values(columns) : [];
}

/**
 * Get primary key for a specific table
 * @param {string} tableName - Table name from TABLES constant
 * @returns {string|Array<string>} Primary key column name(s)
 */
export function getPrimaryKey(tableName) {
    const keyMap = {
        [TABLES.ACCOUNT]: PRIMARY_KEYS.ACCOUNT,
        [TABLES.ROLE]: PRIMARY_KEYS.ROLE,
        [TABLES.ACCOUNT_ROLE]: PRIMARY_KEYS.ACCOUNT_ROLE,
        [TABLES.LOCATION_CITY]: PRIMARY_KEYS.LOCATION_CITY,
        [TABLES.LOCATION_DISTRICT]: PRIMARY_KEYS.LOCATION_DISTRICT,
        [TABLES.LOCATION_WARD]: PRIMARY_KEYS.LOCATION_WARD,
        [TABLES.ADDRESS]: PRIMARY_KEYS.ADDRESS,
        [TABLES.ROUTE]: PRIMARY_KEYS.ROUTE,
        [TABLES.DETAIL_ROUTE]: PRIMARY_KEYS.DETAIL_ROUTE,
        [TABLES.PERSON]: PRIMARY_KEYS.PERSON,
        [TABLES.PARENT]: PRIMARY_KEYS.PARENT,
        [TABLES.DRIVER]: PRIMARY_KEYS.DRIVER,
        [TABLES.STUDENT]: PRIMARY_KEYS.STUDENT,
        [TABLES.TIME_ROLE]: PRIMARY_KEYS.TIME_ROLE,
        [TABLES.SCHEDULE]: PRIMARY_KEYS.SCHEDULE,
        [TABLES.PICKUP_SCHEDULE]: PRIMARY_KEYS.PICKUP_SCHEDULE,
        [TABLES.DETAIL_SCHEDULE]: PRIMARY_KEYS.DETAIL_SCHEDULE,
        [TABLES.BUS]: PRIMARY_KEYS.BUS,
        [TABLES.BUS_ROUTE]: PRIMARY_KEYS.BUS_ROUTE,
        [TABLES.REPORT]: PRIMARY_KEYS.REPORT
    };
    return keyMap[tableName] || null;
}

/**
 * Validate enum value for a specific column
 * @param {string} columnName - Column name
 * @param {string} value - Value to validate
 * @returns {boolean} True if valid enum value
 */
export function isValidEnum(columnName, value) {
    const enumMap = {
        [PERSON_COLUMNS.PERSON_TYPE]: Object.values(PERSON_TYPE),
        [PARENT_COLUMNS.PARENT_TYPE]: Object.values(PARENT_TYPE),
        [DRIVER_COLUMNS.DRIVER_EXPERIENCE_TYPE]: Object.values(DRIVER_EXPERIENCE_TYPE),
        [REPORT_COLUMNS.REPORT_TYPE]: Object.values(REPORT_TYPE)
    };
    
    const validValues = enumMap[columnName];
    return validValues ? validValues.includes(value) : true;
}

/**
 * Build SELECT query string for a table
 * @param {string} tableName - Table name
 * @param {Array<string>} columns - Columns to select (optional, defaults to all)
 * @returns {string} SELECT query string
 */
export function buildSelectQuery(tableName, columns = null) {
    const cols = columns || getTableColumnNames(tableName);
    return `SELECT ${cols.join(', ')} FROM ${tableName}`;
}

/**
 * Build INSERT query string for a table
 * @param {string} tableName - Table name
 * @param {Object} data - Data object with column names as keys
 * @returns {Object} Query string and values array
 */
export function buildInsertQuery(tableName, data) {
    const columns = Object.keys(data);
    const placeholders = columns.map(() => '?').join(', ');
    const values = Object.values(data);
    
    return {
        query: `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`,
        values
    };
}

/**
 * Build UPDATE query string for a table
 * @param {string} tableName - Table name
 * @param {Object} data - Data object with column names as keys
 * @param {Object} where - WHERE clause conditions
 * @returns {Object} Query string and values array
 */
export function buildUpdateQuery(tableName, data, where) {
    const setClause = Object.keys(data).map(col => `${col} = ?`).join(', ');
    const whereClause = Object.keys(where).map(col => `${col} = ?`).join(' AND ');
    const values = [...Object.values(data), ...Object.values(where)];
    
    return {
        query: `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`,
        values
    };
}

/**
 * Build DELETE query string for a table
 * @param {string} tableName - Table name
 * @param {Object} where - WHERE clause conditions
 * @returns {Object} Query string and values array
 */
export function buildDeleteQuery(tableName, where) {
    const whereClause = Object.keys(where).map(col => `${col} = ?`).join(' AND ');
    const values = Object.values(where);
    
    return {
        query: `DELETE FROM ${tableName} WHERE ${whereClause}`,
        values
    };
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
    SCHEMA,
    TABLES,
    ACCOUNT_COLUMNS,
    ROLE_COLUMNS,
    ACCOUNT_ROLE_COLUMNS,
    LOCATION_CITY_COLUMNS,
    LOCATION_DISTRICT_COLUMNS,
    LOCATION_WARD_COLUMNS,
    ADDRESS_COLUMNS,
    ROUTE_COLUMNS,
    DETAIL_ROUTE_COLUMNS,
    PERSON_COLUMNS,
    PARENT_COLUMNS,
    DRIVER_COLUMNS,
    STUDENT_COLUMNS,
    TIME_ROLE_COLUMNS,
    SCHEDULE_COLUMNS,
    PICKUP_SCHEDULE_COLUMNS,
    DETAIL_SCHEDULE_COLUMNS,
    BUS_COLUMNS,
    BUS_ROUTE_COLUMNS,
    REPORT_COLUMNS,
    PERSON_TYPE,
    PARENT_TYPE,
    DRIVER_EXPERIENCE_TYPE,
    REPORT_TYPE,
    PRIMARY_KEYS,
    FOREIGN_KEYS,
    UNIQUE_CONSTRAINTS,
    DEFAULT_VALUES,
    getTableColumns,
    getTableColumnNames,
    getPrimaryKey,
    isValidEnum,
    buildSelectQuery,
    buildInsertQuery,
    buildUpdateQuery,
    buildDeleteQuery
};

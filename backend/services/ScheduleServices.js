import { default as ScheduleDAO } from "../infrastructure/data/scheduleDAO.js";
import { default as PersonDAO } from "../infrastructure/data/personDAO.js";
import { default as DriverDAO } from "../infrastructure/data/driverDAO.js";
import { default as DetailScheduleDAO } from "../infrastructure/data/detailScheduleDAO.js";
import { default as BusRouteDAO } from "../infrastructure/data/busRouteDAO.js";
import { default as RouteDAO } from "../infrastructure/data/routeDAO.js";
import { default as BusDAO } from "../infrastructure/data/busDAO.js";
import Schedule from "../models/Schedule.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";
import DriverServices from "./DriverServices.js";
import TimeRoleDAO from "../infrastructure/data/timeRoleDAO.js";

/**
 * ScheduleServices
 * Service layer for managing schedules
 * Manages its own database connections and transactions
 */
class ScheduleServices {
    /**
     * Get all schedules
     * @return {Promise<{success: boolean, data?: Schedule[], error?: string}>}
     */
    async getAllSchedules() {
    try {
        const results = await withConnection(async (connection) => {
            const scheduleRepo = new ScheduleDAO(connection);
            const detailScheduleRepo = new DetailScheduleDAO(connection);
            const busRouteRepo = new BusRouteDAO(connection);
            const routeRepo = new RouteDAO(connection);
            const busRepo = new BusDAO(connection);
            const driverService = new DriverServices();
            const timeRoleRepo = new TimeRoleDAO(connection);
            
            // Get schedules
            const schedules = await scheduleRepo.getAllSchedules();
            if (schedules.length === 0) return [];
            
            // Load drivers with persons
            const drivers = (await driverService.getAllDrivers()).data;
            const driverMap = new Map(drivers.map(d => [d.driver_person_id, d]));
            
            // Load ALL detail schedules at once (more efficient)
            const allDetailSchedules = await detailScheduleRepo.getAllDetailSchedules();
            
            // Load bus routes, routes, buses, and time roles
            const busRoutes = await busRouteRepo.getAllBusRoutes();
            const routes = await routeRepo.getAllRoutes();
            const buses = await busRepo.getAllBuses();
            const timeRoles = await timeRoleRepo.getAllTimeRoles();
            
            // Create lookup maps
            const routeMap = new Map(routes.map(r => [r.route_id, r]));
            const busMap = new Map(buses.map(b => [b.bus_id, b]));
            const timeRoleMap = new Map(timeRoles.map(tr => [tr.time_role_id, tr]));
            
            // Attach route and bus to each busRoute
            busRoutes.forEach(busRoute => {
                busRoute.route = routeMap.get(busRoute.route_id) || null;
                busRoute.bus = busMap.get(busRoute.bus_id) || null;
            });
            const busRouteMap = new Map(busRoutes.map(br => [br.bus_route_id, br]));
            
            // Attach navigation properties to detail schedules
            allDetailSchedules.forEach(ds => {
                ds.busRoute = busRouteMap.get(ds.detail_schedule_bus_route_id) || null;
                ds.timeRole = timeRoleMap.get(ds.detail_schedule_time_role_id) || null;
            });
            
            // Group detail schedules by schedule_id
            const detailScheduleMap = new Map();
            allDetailSchedules.forEach(ds => {
                if (!detailScheduleMap.has(ds.schedule_id)) {
                    detailScheduleMap.set(ds.schedule_id, []);
                }
                detailScheduleMap.get(ds.schedule_id).push(ds);
            });
            
            // Assign navigation properties to schedules
            schedules.forEach(schedule => {
                schedule.driver = driverMap.get(schedule.schedule_driver_id) || null;
                schedule.detailSchedules = detailScheduleMap.get(schedule.schedule_id) ?
                    [detailScheduleMap.get(schedule.schedule_id)[0]] : [];
            });
            
            return schedules;
        });
        
        return {
            success: true,
            data: results
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

    /**
     * Get schedule by ID
     * @param {number} scheduleId
     * @return {Promise<{success: boolean, data?: Schedule, error?: string}>}
     */
    async getByScheduleId(scheduleId) {
        try {
            if (!scheduleId || !Number.isInteger(scheduleId)) {
                return {
                    success: false,
                    error: 'Invalid scheduleId'
                };
            }

            const result = await withConnection(async (connection) => {
                const scheduleRepo = new ScheduleDAO(connection);
                const personRepo = new PersonDAO(connection);
                const driverRepo = new DriverDAO(connection);
                const detailScheduleRepo = new DetailScheduleDAO(connection);
                const busRouteRepo = new BusRouteDAO(connection);
                const routeRepo = new RouteDAO(connection);
                const busRepo = new BusDAO(connection);
                
                const schedule = await scheduleRepo.getByScheduleId(scheduleId);
                if (!schedule || schedule.schedule_id === 0) return schedule;
                                
                // Load driver with person
                if (schedule.schedule_driver_id) {
                    schedule.driver = await driverRepo.getByDriverPersonId(schedule.schedule_driver_id);
                    if (schedule.driver && schedule.driver.driver_person_id) {
                        schedule.driver.person = await personRepo.getByPersonId(schedule.driver.driver_person_id);
                    }
                }
                
                // Load detail schedules
                const detailSchedules = await detailScheduleRepo.getByScheduleId(schedule.schedule_id);
                
                // Load bus routes
                const busRouteIds = [...new Set(detailSchedules.map(ds => ds.detail_schedule_bus_route_id).filter(id => id))];
                const busRoutes = busRouteIds.length > 0 ? await busRouteRepo.getByBusRouteIds(busRouteIds) : [];
                
                // Load routes and buses
                const routeIds = [...new Set(busRoutes.map(br => br.route_id).filter(id => id))];
                const routes = routeIds.length > 0 ? await routeRepo.getByRouteIds(routeIds) : [];
                const routeMap = new Map(routes.map(r => [r.route_id, r]));
                
                const busIds = [...new Set(busRoutes.map(br => br.bus_id).filter(id => id))];
                const buses = busIds.length > 0 ? await busRepo.getByBusIds(busIds) : [];
                const busMap = new Map(buses.map(b => [b.bus_id, b]));
                
                busRoutes.forEach(busRoute => {
                    busRoute.route = routeMap.get(busRoute.route_id) || null;
                    busRoute.bus = busMap.get(busRoute.bus_id) || null;
                });
                const busRouteMap = new Map(busRoutes.map(br => [br.bus_route_id, br]));
                                
                // Attach busRoute to detail schedules
                detailSchedules.forEach(ds => {
                    ds.busRoute = busRouteMap.get(ds.detail_schedule_bus_route_id) || null;
                });
                
                schedule.detailSchedules = detailSchedules;
                
                return schedule;
            });
            
            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create a new schedule
     * @param {Object} scheduleData
     * @return {Promise<{success: boolean, data?: Schedule, error?: string}>}
     */
    async createSchedule(scheduleData) {
        try {
            const result = await withTransaction(async (connection) => {
                const repo = new ScheduleDAO(connection);
                return await repo.createSchedule(scheduleData);
            });
            
            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update a schedule
     * @param {number} scheduleId
     * @param {Object} scheduleData
     * @return {Promise<{success: boolean, data?: Schedule, error?: string}>}
     */
    async updateSchedule(scheduleId, scheduleData) {
        try {
            if (!scheduleId || !Number.isInteger(scheduleId)) {
                return {
                    success: false,
                    error: 'Invalid scheduleId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ScheduleDAO(connection);
                return await repo.updateSchedule(scheduleId, scheduleData);
            });
            
            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete a schedule
     * @param {number} scheduleId
     * @return {Promise<{success: boolean, error?: string}>}
     */
    async deleteSchedule(scheduleId) {
        try {
            if (!scheduleId || !Number.isInteger(scheduleId)) {
                return {
                    success: false,
                    error: 'Invalid scheduleId'
                };
            }

            await withTransaction(async (connection) => {
                const repo = new ScheduleDAO(connection);
                return await repo.deleteSchedule(scheduleId);
            });
            
            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new ScheduleServices();

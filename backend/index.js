/**
 * Backend Server
 * Main entry point for the Express application
 * Port: 5000
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// Đã loại bỏ cấu hình HTTPS, chỉ giữ lại các import cần thiết cho Express

// Controllers Import
import AccountController from './controllers/AccountController.js';
import RoleController from './controllers/RoleController.js';
import AccountRoleController from './controllers/AccountRoleController.js';
import AddressController from './controllers/AddressController.js';
import LocationCityController from './controllers/LocationCityController.js';
import LocationDistrictController from './controllers/LocationDistrictController.js';
import LocationWardController from './controllers/LocationWardController.js';
import PersonController from './controllers/PersonController.js';
import ParentController from './controllers/ParentController.js';
import DriverController from './controllers/DriverController.js';
import StudentController from './controllers/StudentController.js';
import RouteController from './controllers/RouteController.js';
import DetailRouteController from './controllers/DetailRouteController.js';
import BusController from './controllers/BusController.js';
import BusRouteController from './controllers/BusRouteController.js';
import TimeRoleController from './controllers/TimeRoleController.js';
import ScheduleController from './controllers/ScheduleController.js';
import DetailScheduleController from './controllers/DetailScheduleController.js';
import PickupScheduleController from './controllers/PickupScheduleController.js';
import ReportController from './controllers/ReportController.js';

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'https://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health Check Route
app.get('/', (req, res) => {
    res.send(' Backend is ready for frontend!');
});

// API Routes - Authentication & Authorization
app.use('/api/accounts', AccountController);
app.use('/api/roles', RoleController);
app.use('/api/account-roles', AccountRoleController);

// API Routes - Location
app.use('/api/addresses', AddressController);
app.use('/api/cities', LocationCityController);
app.use('/api/districts', LocationDistrictController);
app.use('/api/wards', LocationWardController);

// API Routes - Person & Related
app.use('/api/persons', PersonController);
app.use('/api/parents', ParentController);
app.use('/api/drivers', DriverController);
app.use('/api/students', StudentController);

// API Routes - Transportation
app.use('/api/routes', RouteController);
app.use('/api/detail-routes', DetailRouteController);
app.use('/api/buses', BusController);
app.use('/api/bus-routes', BusRouteController);

// API Routes - Scheduling
app.use('/api/time-roles', TimeRoleController);
app.use('/api/schedules', ScheduleController);
app.use('/api/detail-schedules', DetailScheduleController);
app.use('/api/pickup-schedules', PickupScheduleController);

// API Routes - Reporting
app.use('/api/reports', ReportController);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start HTTP Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 API endpoint: http://localhost:${PORT}`);
    console.log(`✅ All controllers registered successfully`);
});
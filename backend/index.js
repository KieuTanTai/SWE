import express from 'express';
import cors from 'cors';

// Import all controllers
import AccountController from './controllers/AccountController.js';
import AccountRoleController from './controllers/AccountRoleController.js';
import DetailRouteController from './controllers/DetailRouteController.js';
import DriverController from './controllers/DriverController.js';
import ParentController from './controllers/ParentController.js';
import ReportController from './controllers/ReportController.js';
import RoleController from './controllers/RoleController.js';
import RouteController from './controllers/RouteController.js';

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Middleware ghi log ---
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- API Routes ---
// Register all controllers with /api prefix
app.use('/api/accounts', AccountController);
app.use('/api/account-roles', AccountRoleController);
app.use('/api/detail-routes', DetailRouteController);
app.use('/api/drivers', DriverController);
app.use('/api/parents', ParentController);
app.use('/api/reports', ReportController);
app.use('/api/roles', RoleController);
app.use('/api/routes', RouteController);

// --- Route test ---
app.get('/', (req, res) => {
    res.json({ 
        message: 'School Bus System API',
        version: '1.0.0',
        endpoints: {
            accounts: '/api/accounts',
            accountRoles: '/api/account-roles',
            detailRoutes: '/api/detail-routes',
            drivers: '/api/drivers',
            parents: '/api/parents',
            reports: '/api/reports',
            roles: '/api/roles',
            routes: '/api/routes'
        }
    });
});

// --- 404 Handler ---
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.url}`,
        availableEndpoints: {
            accounts: '/api/accounts',
            accountRoles: '/api/account-roles',
            detailRoutes: '/api/detail-routes',
            drivers: '/api/drivers',
            parents: '/api/parents',
            reports: '/api/reports',
            roles: '/api/roles',
            routes: '/api/routes'
        }
    });
});

// --- Error Handler ---
app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    
    res.status(err.status || 500).json({
        error: err.name || 'Internal Server Error',
        message: err.message || 'Something went wrong',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// --- Khởi động server ---
app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║     School Bus System (SSB) API Server                     ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║  Server running: http://localhost:${PORT}                  ║`);
    console.log('║  Environment:    Development                               ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║  Available Endpoints:                                      ║');
    console.log('║  • /api/accounts        - Account management               ║');
    console.log('║  • /api/account-roles   - Account-Role relationships       ║');
    console.log('║  • /api/detail-routes   - Route details                    ║');
    console.log('║  • /api/drivers         - Driver management                ║');
    console.log('║  • /api/parents         - Parent management                ║');
    console.log('║  • /api/reports         - Report management                ║');
    console.log('║  • /api/roles           - Role management                  ║');
    console.log('║  • /api/routes          - Route management                 ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║  Total: 117+ endpoints across 8 resources                  ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('✅ Server ready to accept requests');
    console.log('');
});

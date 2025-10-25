import express from 'express';
import bodyParser from 'body-parser';
import DriverController from './controllers/DriverController.js';
import ReportController from './controllers/ReportController.js';
import ParentController from './controllers/ParentController.js';

const app = express();
app.use(bodyParser.json());

app.use('/api/driver', DriverController);
app.use('/api/parent', ParentController);
app.use('/api/report', ReportController);

import cors from 'cors';

const PORT = 5000;

// --- Middleware cơ bản ---
app.use(cors());
app.use(express.json());

// --- Middleware ghi log ---
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- Route test ---
app.get('/', (req, res) => {
    res.send(' Hello from Express on port 5000!');
});

// --- Khởi động server ---
app.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
});

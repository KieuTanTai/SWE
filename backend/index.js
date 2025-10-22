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


const PORT = 5000;

app.get('/', (req, res) => {
    res.send('Hello from Express on port 5000!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
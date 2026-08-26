require('dotenv').config();

const express = require('express');
const cors = require('cors');


const activityLogsRoutes =
    require("./routes/activityLogs");

const auditLogsRoutes =
    require("./routes/auditLogs");
const equipmentRoutes = require('./routes/equipment');
const maintenanceRoutes = require('./routes/maintenance');
const authRoutes = require('./routes/auth');
const dashboardRoutes =
    require("./routes/dashboard");
const auditTrailRoutes =
    require("./routes/auditTrail");

const app = express();


app.use(
    "/api/activity-logs",
    activityLogsRoutes
);

app.use(
    "/api/audit-logs",
    auditLogsRoutes
);
app.use(cors());
app.use(express.json());
app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.use('/api/equipment', equipmentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/auth', authRoutes);
app.use(
    "/api/audit-trail",
    auditTrailRoutes
);

app.get('/', (req, res) => {
    res.json({
        message: 'Equipment Maintenance API berjalan'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
require('dotenv').config();

const express = require('express');
const cors = require('cors');


// ======================================================
// ROUTES
// ======================================================

const activityLogsRoutes =
    require("./routes/activityLogs");

const auditLogsRoutes =
    require("./routes/auditLogs");

const equipmentRoutes =
    require('./routes/equipment');

const maintenanceRoutes =
    require('./routes/maintenance');

const authRoutes =
    require('./routes/auth');

const dashboardRoutes =
    require("./routes/dashboard");

const auditTrailRoutes =
    require("./routes/auditTrail");


// ======================================================
// APP
// ======================================================

const app = express();


// ======================================================
// CORS
// ======================================================
//
// WAJIB diletakkan sebelum semua route
//
// Frontend:
// http://localhost:5173
//
// Backend:
// http://localhost:3000
//
// ======================================================

app.use(
    cors({
        origin: "http://localhost:5173",

        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);


// ======================================================
// BODY PARSER
// ======================================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ======================================================
// ACTIVITY LOGS
// ======================================================

app.use(
    "/api/activity-logs",
    activityLogsRoutes
);


// ======================================================
// AUDIT LOGS
// ======================================================

app.use(
    "/api/audit-logs",
    auditLogsRoutes
);


// ======================================================
// DASHBOARD
// ======================================================

app.use(
    "/api/dashboard",
    dashboardRoutes
);


// ======================================================
// EQUIPMENT
// ======================================================

app.use(
    '/api/equipment',
    equipmentRoutes
);


// ======================================================
// MAINTENANCE
// ======================================================

app.use(
    '/api/maintenance',
    maintenanceRoutes
);


// ======================================================
// AUTH
// ======================================================

app.use(
    '/api/auth',
    authRoutes
);


// ======================================================
// AUDIT TRAIL
// ======================================================

app.use(
    "/api/audit-trail",
    auditTrailRoutes
);


// ======================================================
// ROOT
// ======================================================

app.get('/', (req, res) => {

    res.json({

        success: true,

        message:
            'Equipment Maintenance API berjalan'

    });

});


// ======================================================
// PORT
// ======================================================

const PORT =
    process.env.PORT || 3000;


// ======================================================
// START SERVER
// ======================================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server berjalan di http://localhost:${PORT}`
        );

    }
);
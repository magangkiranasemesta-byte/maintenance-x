const express = require("express");

const router = express.Router();

const controller =
    require("../controllers/auditLogController");


// GET ALL AUDIT LOG

router.get(
    "/",
    controller.getAuditLogs
);


module.exports = router;
const express = require("express");

const router = express.Router();

const controller =
    require("../controllers/activityLogController");


// GET ALL ACTIVITY LOG

router.get(
    "/",
    controller.getActivityLogs
);


module.exports = router;
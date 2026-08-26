const db = require("../db");


// ======================================================
// GET USER ID
// ======================================================

function getUserId(req) {

    // Kalau nanti authentication middleware
    // sudah memasukkan user ke req.user
    if (req.user?.id) {
        return req.user.id;
    }

    // Fallback dari body
    if (req.body?.user_id) {
        return req.body.user_id;
    }

    return null;
}


// ======================================================
// GET IP ADDRESS
// ======================================================

function getIpAddress(req) {

    return (
        req.headers["x-forwarded-for"] ||
        req.socket?.remoteAddress ||
        null
    );

}


// ======================================================
// ACTIVITY LOG
// ======================================================

function logActivity({
    req,
    userId = null,
    action,
    module,
    description
}) {

    const finalUserId =
        userId || getUserId(req);

    const ipAddress =
        getIpAddress(req);


    const sql = `
        INSERT INTO activity_logs
        (
            user_id,
            action,
            module,
            description,
            ip_address
        )
        VALUES (?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            finalUserId,
            action,
            module,
            description || null,
            ipAddress
        ],
        (error) => {

            if (error) {

                console.error(
                    "ACTIVITY LOG ERROR:",
                    error
                );

            }

        }
    );

}


// ======================================================
// AUDIT LOG
// ======================================================

function logAudit({
    req,
    userId = null,
    module,
    recordId,
    action,
    oldData = null,
    newData = null,
    description
}) {

    const finalUserId =
        userId || getUserId(req);

    const ipAddress =
        getIpAddress(req);


    const sql = `
        INSERT INTO audit_logs
        (
            user_id,
            module,
            record_id,
            action,
            old_data,
            new_data,
            description,
            ip_address
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            finalUserId,
            module,
            recordId,
            action,
            oldData
                ? JSON.stringify(oldData)
                : null,
            newData
                ? JSON.stringify(newData)
                : null,
            description || null,
            ipAddress
        ],
        (error) => {

            if (error) {

                console.error(
                    "AUDIT LOG ERROR:",
                    error
                );

            }

        }
    );

}


module.exports = {
    logActivity,
    logAudit
};
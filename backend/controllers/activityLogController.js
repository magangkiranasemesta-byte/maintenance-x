const db = require("../db");


// ======================================================
// GET ACTIVITY LOGS
// ======================================================

exports.getActivityLogs = (req, res) => {

    const sql = `
        SELECT
            al.id,
            al.user_id,
            COALESCE(u.name, u.username, 'System') AS user_name,
            al.action,
            al.module,
            al.description,
            al.ip_address,
            al.created_at
        FROM activity_logs al
        LEFT JOIN users u
            ON u.id = al.user_id
        ORDER BY al.created_at DESC
    `;


    db.query(
        sql,
        (error, results) => {

            if (error) {

                console.error(
                    "Get activity logs error:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Gagal mengambil activity log"
                });

            }


            res.json({
                success: true,
                data: results
            });

        }
    );

};
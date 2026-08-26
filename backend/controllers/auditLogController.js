const db = require("../db");


// ======================================================
// GET AUDIT LOGS
// ======================================================

exports.getAuditLogs = (req, res) => {

    const sql = `
        SELECT
            al.id,
            al.user_id,
            COALESCE(u.name, u.username, 'System') AS user_name,
            al.module,
            al.record_id,
            al.action,
            al.old_data,
            al.new_data,
            al.description,
            al.ip_address,
            al.created_at
        FROM audit_logs al
        LEFT JOIN users u
            ON u.id = al.user_id
        ORDER BY al.created_at DESC
    `;


    db.query(
        sql,
        (error, results) => {

            if (error) {

                console.error(
                    "Get audit logs error:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Gagal mengambil audit log"
                });

            }


            res.json({
                success: true,
                data: results
            });

        }
    );

};
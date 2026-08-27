const express = require("express");

const router = express.Router();

const db = require("../db");


router.get("/", (req, res) => {

    const sql = `
        SELECT
            al.id,
            al.user_id,
            u.username,
            al.module,
            al.record_id,
            al.action,
            al.old_data,
            al.new_data,
            al.description,
            al.created_at

        FROM audit_logs al

        LEFT JOIN users u
            ON al.user_id = u.id

        ORDER BY al.created_at DESC
    `;


    db.query(
        sql,
        (error, results) => {

            if (error) {

                console.error(
                    "GET AUDIT TRAIL ERROR:",
                    error
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Gagal mengambil audit trail",

                    error:
                        error.message

                });

            }


            return res.json({

                success: true,

                data: results

            });

        }
    );

});


module.exports = router;
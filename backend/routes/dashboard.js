const express = require("express");

const router = express.Router();

const db = require("../db");


// ======================================================
// GET DASHBOARD STATISTICS
// ======================================================

router.get("/stats", (req, res) => {

    const sql = `

        SELECT

            COUNT(
                DISTINCT equipment_id
            ) AS totalEquipment,

            SUM(
                CASE
                    WHEN LOWER(
                        REPLACE(
                            COALESCE(status, ''),
                            '_',
                            ' '
                        )
                    ) IN (
                        'approved',
                        'in progress',
                        'on progress'
                    )
                    THEN 1
                    ELSE 0
                END
            ) AS activeMaintenance,

            SUM(
                CASE
                    WHEN LOWER(
                        REPLACE(
                            COALESCE(status, ''),
                            '_',
                            ' '
                        )
                    ) = 'waiting approval'
                    THEN 1
                    ELSE 0
                END
            ) AS pendingApproval,

            SUM(
                CASE
                    WHEN LOWER(
                        REPLACE(
                            COALESCE(status, ''),
                            '_',
                            ' '
                        )
                    ) IN (
                        'completed',
                        'complete'
                    )
                    THEN 1
                    ELSE 0
                END
            ) AS completed

        FROM maintenance_requests

    `;


    db.query(
        sql,
        (err, results) => {

            if (err) {

                console.error(
                    "DASHBOARD STATS ERROR:",
                    err
                );


                return res.status(500).json({

                    message:
                        "Gagal mengambil statistik dashboard",

                    error:
                        err.message

                });

            }


            const data =
                results[0] || {};


            return res.json({

                totalEquipment:
                    Number(
                        data.totalEquipment || 0
                    ),

                activeMaintenance:
                    Number(
                        data.activeMaintenance || 0
                    ),

                pendingApproval:
                    Number(
                        data.pendingApproval || 0
                    ),

                completed:
                    Number(
                        data.completed || 0
                    )

            });

        }
    );

});


module.exports = router;
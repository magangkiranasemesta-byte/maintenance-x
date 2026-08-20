const express = require("express");

const router = express.Router();

const db = require("../db");


// ======================================================
// GET ALL MAINTENANCE
// ======================================================

router.get("/", (req, res) => {

    const sql = `
        SELECT *
        FROM maintenance_requests
        ORDER BY created_at DESC
    `;


    db.query(
        sql,
        (err, results) => {

            if (err) {

                console.error(
                    "GET MAINTENANCE ERROR:",
                    err
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Gagal mengambil data maintenance",

                    error:
                        err.message

                });

            }


            res.json(results);

        }
    );

});


// ======================================================
// CREATE MAINTENANCE REQUEST
// ENGINEER → PENDING_SUPERVISOR
// ======================================================

router.post("/", (req, res) => {

    const {
        equipment_id,
        engineer_id,
        description,
        priority
    } = req.body;


    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (
        !equipment_id ||
        !engineer_id ||
        !description
    ) {

        return res.status(400).json({

            success: false,

            message:
                "equipment_id, engineer_id, dan description wajib diisi"

        });

    }


    // -----------------------------------------------
    // INSERT
    // -----------------------------------------------

    const sql = `
        INSERT INTO maintenance_requests
        (
            equipment_id,
            engineer_id,
            description,
            priority,
            status
        )
        VALUES (?, ?, ?, ?, ?)
    `;


    const values = [

        equipment_id,

        engineer_id,

        description,

        priority || "MEDIUM",

        "PENDING_SUPERVISOR"

    ];


    db.query(
        sql,
        values,
        (err, result) => {

            if (err) {

                console.error(
                    "CREATE MAINTENANCE ERROR:",
                    err
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Gagal membuat maintenance request",

                    error:
                        err.message

                });

            }


            res.status(201).json({

                success: true,

                message:
                    "Maintenance request berhasil dibuat",

                id:
                    result.insertId,

                status:
                    "PENDING_SUPERVISOR"

            });

        }
    );

});


// ======================================================
// UPDATE STATUS
//
// ENGINEER
//    ↓
// PENDING_SUPERVISOR
//    ↓
// SUPERVISOR
//    ↓
// WAITING_MANAGER_APPROVAL
//    ↓
// MANAGER
//    ↓
// APPROVED
// ======================================================

router.put("/:id/status", (req, res) => {

    const {
        id
    } = req.params;


    const {
        status
    } = req.body;


    console.log("");
    console.log("========================================");
    console.log("APPROVAL REQUEST");
    console.log("========================================");
    console.log(
        "Maintenance ID :",
        id
    );
    console.log(
        "Status baru    :",
        status
    );
    console.log("========================================");


    // ==================================================
    // STATUS YANG DIPERBOLEHKAN
    // ==================================================

    const allowedStatuses = [

        "PENDING_SUPERVISOR",

        "WAITING_MANAGER_APPROVAL",

        "APPROVED",

        "REJECTED"

    ];


    if (!status) {

        return res.status(400).json({

            success: false,

            message:
                "Status wajib diisi"

        });

    }


    if (
        !allowedStatuses.includes(status)
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Status tidak valid",

            received:
                status,

            allowed:
                allowedStatuses

        });

    }


    // ==================================================
    // AMBIL STATUS SEKARANG
    // ==================================================

    const selectSql = `
        SELECT
            id,
            status
        FROM maintenance_requests
        WHERE id = ?
    `;


    db.query(
        selectSql,
        [id],
        (selectError, rows) => {

            if (selectError) {

                console.error(
                    "SELECT STATUS ERROR:",
                    selectError
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Gagal membaca status maintenance",

                    error:
                        selectError.message

                });

            }


            // ------------------------------------------
            // DATA TIDAK ADA
            // ------------------------------------------

            if (
                !rows ||
                rows.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Maintenance request tidak ditemukan"

                });

            }


            const currentStatus =
                String(
                    rows[0].status || ""
                )
                    .trim()
                    .toUpperCase();


            console.log(
                "Status sekarang :",
                currentStatus
            );


            // ==================================================
            // SUPERVISOR APPROVE
            //
            // PENDING_SUPERVISOR
            //          ↓
            // WAITING_MANAGER_APPROVAL
            // ==================================================

            if (
                status ===
                    "WAITING_MANAGER_APPROVAL"
            ) {

                if (
                    currentStatus !==
                    "PENDING_SUPERVISOR"
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            `Supervisor tidak dapat approve. Status sekarang: ${currentStatus}`

                    });

                }

            }


            // ==================================================
            // MANAGER APPROVE
            //
            // WAITING_MANAGER_APPROVAL
            //          ↓
            // APPROVED
            // ==================================================

            if (
                status ===
                    "APPROVED"
            ) {

                if (
                    currentStatus !==
                    "WAITING_MANAGER_APPROVAL"
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            `Manager tidak dapat approve. Status sekarang: ${currentStatus}`

                    });

                }

            }


            // ==================================================
            // REJECT
            // ==================================================

            if (
                status ===
                    "REJECTED"
            ) {

                if (
                    currentStatus !==
                        "PENDING_SUPERVISOR" &&
                    currentStatus !==
                        "WAITING_MANAGER_APPROVAL"
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            `Request tidak dapat ditolak dari status ${currentStatus}`

                    });

                }

            }


            // ==================================================
            // UPDATE DATABASE
            // ==================================================

            const updateSql = `
                UPDATE maintenance_requests
                SET status = ?
                WHERE id = ?
            `;


            db.query(
                updateSql,
                [
                    status,
                    id
                ],
                (updateError, result) => {

                    if (updateError) {

                        console.error("");
                        console.error(
                            "========================================"
                        );
                        console.error(
                            "DATABASE UPDATE ERROR"
                        );
                        console.error(
                            "========================================"
                        );
                        console.error(
                            "Code:",
                            updateError.code
                        );
                        console.error(
                            "Message:",
                            updateError.message
                        );
                        console.error(
                            updateError
                        );
                        console.error(
                            "========================================"
                        );


                        return res.status(500).json({

                            success: false,

                            message:
                                "Gagal mengubah status maintenance",

                            error:
                                updateError.message,

                            code:
                                updateError.code

                        });

                    }


                    // ------------------------------------------
                    // BERHASIL
                    // ------------------------------------------

                    console.log("");
                    console.log(
                        `Maintenance #${id}: ${currentStatus} → ${status}`
                    );
                    console.log("");


                    return res.json({

                        success: true,

                        message:
                            "Status maintenance berhasil diubah",

                        id:
                            Number(id),

                        previous_status:
                            currentStatus,

                        status:
                            status

                    });

                }
            );

        }
    );

});


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;
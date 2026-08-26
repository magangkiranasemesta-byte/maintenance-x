const express = require("express");

const router = express.Router();

const db = require("../db");

const {
    logActivity,
    logAudit
} = require("../utils/logger");


// ======================================================
// STATUS DATABASE
// ======================================================
//
// PENDING_SUPERVISOR
// PENDING_MANAGER
// REJECTED
// APPROVED
// IN_PROGRESS
// COMPLETED
//
// ======================================================


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

            logActivity({

                req,

                userId: engineer_id,

                action: "CREATE",

                module: "Maintenance",

                description:
                    `Maintenance #${result.insertId} dibuat dengan status PENDING_SUPERVISOR`

            });

             // ==================================================
        // AUDIT LOG
        // ==================================================

        logAudit({

            req,

            userId: engineer_id,

            module: "Maintenance",

            recordId: result.insertId,

            action: "CREATE",

            oldData: null,

            newData: {

                status:
                    "PENDING_SUPERVISOR",

                equipment_id,

                engineer_id,

                description,

                priority:
                    priority || "MEDIUM"

            },

            description:
                `Maintenance #${result.insertId} dibuat`

        });

            return res.json(results);

        }
    );

});


// ======================================================
// CREATE MAINTENANCE REQUEST
//
// ENGINEER
//    ↓
// PENDING_SUPERVISOR
// ======================================================

router.post("/", (req, res) => {

    const {
        equipment_id,
        engineer_id,
        description,
        priority
    } = req.body;


    // ==================================================
    // VALIDATION
    // ==================================================

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

    // ======================================================
// GET MAINTENANCE HISTORY
// ======================================================

router.get("/history", (req, res) => {

    const sql = `
        SELECT
            mr.id AS maintenance_id,
            mr.equipment_id,
            mr.engineer_id,
            mr.description,
            mr.priority,
            mr.status,
            mr.created_at,

            e.name AS equipment_name,

            u.username AS engineer_name

        FROM maintenance_requests mr

        LEFT JOIN equipment e
            ON mr.equipment_id = e.id

        LEFT JOIN users u
            ON mr.engineer_id = u.id

        WHERE mr.status IN (
            'REJECTED',
            'APPROVED',
            'IN_PROGRESS',
            'COMPLETED'
        )

        ORDER BY mr.created_at DESC
    `;

    db.query(sql, (error, results) => {

        if (error) {

            console.error(
                "GET MAINTENANCE HISTORY ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Gagal mengambil maintenance history",
                error: error.message
            });
        }

        return res.json(results);
    });
});


    // ==================================================
    // INSERT
    // ==================================================

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


            return res.status(201).json({

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
// ======================================================
//
// PENDING_SUPERVISOR
//        ↓
// PENDING_MANAGER
//        ↓
// APPROVED
//        ↓
// IN_PROGRESS
//        ↓
// COMPLETED
//
// REJECT:
//
// PENDING_SUPERVISOR → REJECTED
// PENDING_MANAGER    → REJECTED
//
// ======================================================

router.put("/:id/status", (req, res) => {

    const {
        id
    } = req.params;


    // ==================================================
    // AMBIL STATUS DARI BODY
    // ==================================================

    const rawStatus =
        req.body?.status;


    // ==================================================
    // NORMALISASI STATUS
    // ==================================================

    let status =
        String(
            rawStatus || ""
        )
            .trim()
            .toUpperCase();


    console.log("");
    console.log(
        "========================================"
    );

    console.log(
        "APPROVAL REQUEST"
    );

    console.log(
        "========================================"
    );

    console.log(
        "Maintenance ID :",
        id
    );

    console.log(
        "Status dari FE :",
        rawStatus
    );

    console.log(
        "Status normal  :",
        status
    );

    console.log(
        "========================================"
    );


    // ==================================================
    // COMPATIBILITY STATUS
    //
    // Kalau frontend lama masih mengirim:
    //
    // WAITING_MANAGER_APPROVAL
    //
    // backend otomatis mengubahnya menjadi:
    //
    // PENDING_MANAGER
    //
    // ==================================================

    const statusAliases = {

        WAITING_MANAGER_APPROVAL:
            "PENDING_MANAGER"

    };


    if (
        statusAliases[status]
    ) {

        console.log(
            `Status alias ditemukan: ${status} → ${statusAliases[status]}`
        );

        status =
            statusAliases[status];

    }


    // ==================================================
    // STATUS YANG DIPERBOLEHKAN
    // ==================================================

    const allowedStatuses = [

        "PENDING_SUPERVISOR",

        "PENDING_MANAGER",

        "REJECTED",

        "APPROVED",

        "IN_PROGRESS",

        "COMPLETED"

    ];


    // ==================================================
    // VALIDASI STATUS KOSONG
    // ==================================================

    if (!status) {

        return res.status(400).json({

            success: false,

            message:
                "Status wajib diisi",

            received:
                rawStatus

        });

    }


    // ==================================================
    // VALIDASI STATUS
    // ==================================================

    if (
        !allowedStatuses.includes(status)
    ) {

        console.error(
            "STATUS TIDAK VALID:",
            status
        );

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


            // ==================================================
            // DATA TIDAK DITEMUKAN
            // ==================================================

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


            // ==================================================
            // STATUS SEKARANG
            // ==================================================

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
            //        ↓
            // PENDING_MANAGER
            // ==================================================

            if (
                status ===
                "PENDING_MANAGER"
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
            // PENDING_MANAGER
            //        ↓
            // APPROVED
            // ==================================================

            if (
                status ===
                "APPROVED"
            ) {

                if (
                    currentStatus !==
                    "PENDING_MANAGER"
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
            //
            // PENDING_SUPERVISOR
            //        ↓
            // REJECTED
            //
            // PENDING_MANAGER
            //        ↓
            // REJECTED
            // ==================================================

            if (
                status ===
                "REJECTED"
            ) {

                if (
                    currentStatus !==
                    "PENDING_SUPERVISOR" &&
                    currentStatus !==
                    "PENDING_MANAGER"
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            `Request tidak dapat ditolak dari status ${currentStatus}`

                    });

                }

            }


            // ==================================================
            // APPROVED → IN_PROGRESS
            // ==================================================

            if (
                status ===
                "IN_PROGRESS"
            ) {

                if (
                    currentStatus !==
                    "APPROVED"
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            `Maintenance tidak dapat dimulai. Status sekarang: ${currentStatus}`

                    });

                }

            }


            // ==================================================
            // IN_PROGRESS → COMPLETED
            // ==================================================

            if (
                status ===
                "COMPLETED"
            ) {

                if (
                    currentStatus !==
                    "IN_PROGRESS"
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            `Maintenance belum dapat diselesaikan. Status sekarang: ${currentStatus}`

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


                    // ==================================================
                    // TIDAK ADA BARIS BERUBAH
                    // ==================================================

                    if (
                        result.affectedRows === 0
                    ) {

                        return res.status(404).json({

                            success: false,

                            message:
                                "Maintenance request tidak ditemukan"

                        });

                        // ======================================================
// ACTIVITY LOG
// ======================================================

let activityAction = "STATUS_CHANGE";


// Supervisor approve

if (
    currentStatus === "PENDING_SUPERVISOR" &&
    status === "PENDING_MANAGER"
) {

    activityAction = "APPROVE";

}


// Manager approve

else if (
    currentStatus === "PENDING_MANAGER" &&
    status === "APPROVED"
) {

    activityAction = "APPROVE";

}


// Reject

else if (
    status === "REJECTED"
) {

    activityAction = "REJECT";

}


// Start maintenance

else if (
    status === "IN_PROGRESS"
) {

    activityAction = "START";

}


// Complete maintenance

else if (
    status === "COMPLETED"
) {

    activityAction = "COMPLETE";

}


logActivity({

    req,

    action:
        activityAction,

    module:
        "Maintenance",

    description:
        `Maintenance #${id}: ${currentStatus} → ${status}`

});


// ======================================================
// AUDIT LOG
// ======================================================

logAudit({

    req,

    module:
        "Maintenance",

    recordId:
        Number(id),

    action:
        "STATUS_CHANGE",

    oldData: {

        status:
            currentStatus

    },

    newData: {

        status:
            status

    },

    description:
        `Status maintenance #${id} berubah dari ${currentStatus} menjadi ${status}`

});

                    }


                    // ==================================================
                    // BERHASIL
                    // ==================================================

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

router.get("/history", (req, res) => {

    const sql = `
        SELECT
            mr.id AS maintenance_id,
            mr.equipment_id,
            mr.engineer_id,
            mr.description,
            mr.priority,
            mr.status,
            mr.created_at,
            e.name AS equipment_name,
            u.username AS engineer_name
        FROM maintenance_requests mr
        LEFT JOIN equipment e
            ON mr.equipment_id = e.id
        LEFT JOIN users u
            ON mr.engineer_id = u.id
        WHERE mr.status IN (
            'REJECTED',
            'APPROVED',
            'IN_PROGRESS',
            'COMPLETED'
        )
        ORDER BY mr.created_at DESC
    `;

    db.query(sql, (error, results) => {

        if (error) {
            console.error(
                "HISTORY ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Gagal mengambil history",
                error: error.message
            });
        }

        res.json(results);
    });
});


// ======================================================
// EXPORT
// ======================================================

module.exports = router;
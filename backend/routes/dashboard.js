const express = require("express");
const router = express.Router();
const db = require("../db");

// ======================================================
// HELPER QUERY
// ======================================================

function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(results);
        });
    });
}

// ======================================================
// GET DASHBOARD STATISTICS
// ======================================================

router.get("/stats", async (req, res) => {
    try {
        // ==================================================
        // 1. TOTAL EQUIPMENT
        // ==================================================

        const equipmentStats = await query(`
            SELECT
                COUNT(*) AS totalEquipment,

                SUM(
                    CASE
                        WHEN UPPER(TRIM(status)) = 'ACTIVE'
                        THEN 1
                        ELSE 0
                    END
                ) AS activeEquipment,

                SUM(
                    CASE
                        WHEN UPPER(TRIM(status)) LIKE '%MAINTENANCE%'
                        THEN 1
                        ELSE 0
                    END
                ) AS maintenanceEquipment,

                SUM(
                    CASE
                        WHEN UPPER(TRIM(status)) <> 'ACTIVE'
                             AND UPPER(TRIM(status)) NOT LIKE '%MAINTENANCE%'
                        THEN 1
                        ELSE 0
                    END
                ) AS inactiveEquipment

            FROM equipment
        `);

        // ==================================================
        // 2. MAINTENANCE STATISTICS
        // ==================================================

        const maintenanceStats = await query(`
            SELECT
                COUNT(*) AS totalMaintenance,

                SUM(
                    CASE
                        WHEN status IN (
                            'APPROVED',
                            'IN_PROGRESS'
                        )
                        THEN 1
                        ELSE 0
                    END
                ) AS activeMaintenance,

                SUM(
                    CASE
                        WHEN status IN (
                            'PENDING_SUPERVISOR',
                            'PENDING_MANAGER'
                        )
                        THEN 1
                        ELSE 0
                    END
                ) AS pendingApproval,

                SUM(
                    CASE
                        WHEN status = 'COMPLETED'
                        THEN 1
                        ELSE 0
                    END
                ) AS completed,

                SUM(
                    CASE
                        WHEN status = 'REJECTED'
                        THEN 1
                        ELSE 0
                    END
                ) AS rejected

            FROM maintenance_requests
        `);

        // ==================================================
        // 3. MAINTENANCE TREND
        // ==================================================

        const maintenanceTrend = await query(`
            SELECT
                MONTH(created_at) AS month_number,
                COUNT(*) AS total
            FROM maintenance_requests
            WHERE YEAR(created_at) = YEAR(CURDATE())
            GROUP BY MONTH(created_at)
            ORDER BY MONTH(created_at)
        `);

        // ==================================================
        // 4. MAINTENANCE STATUS
        // ==================================================

        const maintenanceStatus = await query(`
            SELECT
                status,
                COUNT(*) AS total
            FROM maintenance_requests
            GROUP BY status
            ORDER BY status
        `);

        // ==================================================
        // 5. APPROVAL HISTORY
        // ==================================================

        const approvalHistory = await query(`
            SELECT
                ah.id,
                ah.maintenance_id,
                ah.user_id,
                ah.role,
                ah.action,
                ah.note,
                ah.created_at,
                u.username
            FROM approval_history ah
            LEFT JOIN users u
                ON u.id = ah.user_id
            ORDER BY ah.created_at DESC
            LIMIT 20
        `);

        // ==================================================
        // 6. RECENT MAINTENANCE
        // ==================================================

        const recentMaintenance = await query(`
            SELECT
                mr.id,
                mr.equipment_id,
                mr.engineer_id,
                mr.description,
                mr.priority,
                mr.status,
                mr.created_at,
                mr.updated_at,
                e.equipment_code,
                e.name AS equipment_name,
                e.location
            FROM maintenance_requests mr
            LEFT JOIN equipment e
                ON e.id = mr.equipment_id
            ORDER BY mr.created_at DESC
            LIMIT 20
        `);

        // ==================================================
        // 7. COMPLETION RATE
        // ==================================================

        const totalMaintenance =
            Number(maintenanceStats[0]?.totalMaintenance || 0);

        const completed =
            Number(maintenanceStats[0]?.completed || 0);

        const completionRate =
            totalMaintenance > 0
                ? Number(((completed / totalMaintenance) * 100).toFixed(1))
                : 0;

        // ==================================================
        // 8. EQUIPMENT HEALTH
        //
        // Berdasarkan status equipment yang tersedia.
        //
        // ACTIVE       = GOOD
        // MAINTENANCE  = WARNING
        // selain itu   = CRITICAL
        // ==================================================

        const equipmentHealth = {
            good: Number(equipmentStats[0]?.activeEquipment || 0),
            warning: Number(
                equipmentStats[0]?.maintenanceEquipment || 0
            ),
            critical: Number(
                equipmentStats[0]?.inactiveEquipment || 0
            )
        };

        const totalHealthEquipment =
            equipmentHealth.good +
            equipmentHealth.warning +
            equipmentHealth.critical;

        const goodPercentage =
            totalHealthEquipment > 0
                ? Number(
                    (
                        (equipmentHealth.good /
                            totalHealthEquipment) *
                        100
                    ).toFixed(1)
                )
                : 0;

        // ==================================================
        // 9. FORMAT TREND 12 BULAN
        // ==================================================

        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];

        const trendMap = {};

        maintenanceTrend.forEach((item) => {
            trendMap[Number(item.month_number)] =
                Number(item.total);
        });

        const formattedTrend = monthNames.map(
            (month, index) => ({
                month,
                total: trendMap[index + 1] || 0
            })
        );

        // ==================================================
        // 10. RESPONSE
        // ==================================================

        return res.json({
            success: true,

            stats: {
                totalEquipment:
                    Number(
                        equipmentStats[0]?.totalEquipment || 0
                    ),

                activeMaintenance:
                    Number(
                        maintenanceStats[0]?.activeMaintenance || 0
                    ),

                pendingApproval:
                    Number(
                        maintenanceStats[0]?.pendingApproval || 0
                    ),

                completed,

                rejected:
                    Number(
                        maintenanceStats[0]?.rejected || 0
                    ),

                totalMaintenance,

                completionRate,

                // Belum dapat dihitung secara nyata
                // karena database belum mempunyai
                // data uptime/downtime.
                equipmentUptime: null,

                // Belum dapat dihitung secara nyata
                // karena maintenance_requests belum
                // mempunyai due_date / target selesai.
                onTimeMaintenance: null
            },

            maintenanceTrend: formattedTrend,

            maintenanceStatus,

            equipmentHealth: {
                ...equipmentHealth,
                goodPercentage
            },

            approvalHistory,

            recentMaintenance
        });

    } catch (error) {
        console.error(
            "DASHBOARD STATS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Gagal mengambil data dashboard",
            error: error.message
        });
    }
});

module.exports = router;
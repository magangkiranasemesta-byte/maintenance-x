const express = require('express');
const router = express.Router();

const db = require('../db');


// ========================================
// GET - Semua Maintenance Request
// ========================================
router.get('/', (req, res) => {
    const sql = `
        SELECT *
        FROM maintenance_requests
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('ERROR GET MAINTENANCE:', err);

            return res.status(500).json({
                message: 'Gagal mengambil maintenance request',
                error: err.message
            });
        }

        res.json(results);
    });
});


// ========================================
// POST - Tambah Maintenance Request
// ========================================
router.post('/', (req, res) => {
    const {
        equipment_id,
        engineer_id,
        description,
        priority
    } = req.body;

    // Validasi
    if (!equipment_id || !engineer_id || !description) {
        return res.status(400).json({
            message: 'equipment_id, engineer_id, dan description wajib diisi'
        });
    }

    // Status awal
    const status = 'PENDING_SUPERVISOR';

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
        priority || 'MEDIUM',
        status
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('ERROR CREATE MAINTENANCE:', err);

            return res.status(500).json({
                message: 'Gagal membuat maintenance request',
                error: err.message
            });
        }

        res.status(201).json({
            message: 'Maintenance request berhasil dibuat',
            id: result.insertId,
            status: status
        });
    });
});


// ========================================
// GET - Maintenance History
// ========================================
router.get('/history', (req, res) => {
    const sql = `
        SELECT
            mh.id,
            mh.maintenance_id,
            mh.equipment_id,
            mh.engineer_id,
            mh.action,
            mh.result,
            mh.completed_at,
            mr.description,
            mr.status
        FROM maintenance_history mh
        LEFT JOIN maintenance_requests mr
            ON mh.maintenance_id = mr.id
        ORDER BY mh.completed_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('ERROR GET MAINTENANCE HISTORY:', err);

            return res.status(500).json({
                message: 'Gagal mengambil maintenance history',
                error: err.message
            });
        }

        res.json(results);
    });
});


// ========================================
// PUT - Approve / Reject Maintenance
// ========================================
router.put('/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Status yang boleh digunakan Approval
    const allowedStatuses = [
        'APPROVED',
        'REJECTED'
    ];

    // Validasi status
    if (!status) {
        return res.status(400).json({
            message: 'Status wajib diisi'
        });
    }

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: 'Status tidak valid',
            allowedStatuses
        });
    }

    // ========================================
    // 1. Ambil data maintenance request
    // ========================================
    const getRequestSql = `
        SELECT
            id,
            equipment_id,
            engineer_id,
            description,
            status
        FROM maintenance_requests
        WHERE id = ?
    `;

    db.query(getRequestSql, [id], (err, requests) => {

        if (err) {
            console.error('ERROR GET REQUEST:', err);

            return res.status(500).json({
                message: 'Gagal mengambil maintenance request',
                error: err.message
            });
        }

        if (requests.length === 0) {
            return res.status(404).json({
                message: 'Maintenance request tidak ditemukan'
            });
        }

        const maintenance = requests[0];

        // ========================================
        // 2. Pastikan request masih menunggu approval
        // ========================================
        if (maintenance.status !== 'PENDING_SUPERVISOR') {
            return res.status(400).json({
                message:
                    'Maintenance request sudah diproses sebelumnya',
                currentStatus: maintenance.status
            });
        }

        // ========================================
        // 3. Update status maintenance request
        // ========================================
        const updateSql = `
            UPDATE maintenance_requests
            SET status = ?
            WHERE id = ?
        `;

        db.query(
            updateSql,
            [status, id],
            (err, updateResult) => {

                if (err) {
                    console.error(
                        'ERROR UPDATE STATUS:',
                        err
                    );

                    return res.status(500).json({
                        message:
                            'Gagal mengubah status maintenance request',
                        error: err.message
                    });
                }

                if (updateResult.affectedRows === 0) {
                    return res.status(404).json({
                        message:
                            'Maintenance request tidak ditemukan'
                    });
                }

                // ========================================
                // 4. Buat record History
                // ========================================

                const action =
                    status === 'APPROVED'
                        ? 'APPROVE'
                        : 'REJECT';

                const result =
                    status === 'APPROVED'
                        ? 'Maintenance request disetujui Supervisor'
                        : 'Maintenance request ditolak Supervisor';

                const historySql = `
                    INSERT INTO maintenance_history
                    (
                        maintenance_id,
                        equipment_id,
                        engineer_id,
                        action,
                        result,
                        completed_at
                    )
                    VALUES (?, ?, ?, ?, ?, NOW())
                `;

                const historyValues = [
                    maintenance.id,
                    maintenance.equipment_id,
                    maintenance.engineer_id,
                    action,
                    result
                ];

                db.query(
                    historySql,
                    historyValues,
                    (err, historyResult) => {

                        if (err) {
                            console.error(
                                'ERROR INSERT HISTORY:',
                                err
                            );

                            return res.status(500).json({
                                message:
                                    'Status berhasil diubah, tetapi gagal menyimpan history',
                                error: err.message
                            });
                        }

                        // ========================================
                        // 5. Response berhasil
                        // ========================================
                        res.json({
                            message:
                                status === 'APPROVED'
                                    ? 'Maintenance request berhasil disetujui'
                                    : 'Maintenance request berhasil ditolak',

                            id: id,

                            status: status,

                            historyId:
                                historyResult.insertId
                        });
                    }
                );
            }
        );
    });
});


module.exports = router;
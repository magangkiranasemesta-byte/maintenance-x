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
            console.error(err);

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

    const sql = `
        INSERT INTO maintenance_requests
        (equipment_id, engineer_id, description, priority)
        VALUES (?, ?, ?, ?)
    `;

    const values = [
        equipment_id,
        engineer_id,
        description,
        priority || 'MEDIUM'
    ];

    db.query(sql, values, (err, result) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: 'Gagal membuat maintenance request',
                error: err.message
            });

        }

        res.status(201).json({
            message: 'Maintenance request berhasil dibuat',
            id: result.insertId
        });

    });

});


module.exports = router;
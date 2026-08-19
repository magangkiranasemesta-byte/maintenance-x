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


    db.query(
        sql,
        (err, results) => {

            if (err) {

                console.error(err);


                return res.status(500).json({

                    message:
                        'Gagal mengambil maintenance request',

                    error:
                        err.message

                });

            }


            res.json(results);

        }
    );

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

    if (
        !equipment_id ||
        !engineer_id ||
        !description
    ) {

        return res.status(400).json({

            message:
                'equipment_id, engineer_id, dan description wajib diisi'

        });

    }


    const sql = `
        INSERT INTO maintenance_requests
        (
            equipment_id,
            engineer_id,
            description,
            priority
        )
        VALUES (?, ?, ?, ?)
    `;


    const values = [

        equipment_id,

        engineer_id,

        description,

        priority || 'MEDIUM'

    ];


    db.query(
        sql,
        values,
        (err, result) => {

            if (err) {

                console.error(err);


                return res.status(500).json({

                    message:
                        'Gagal membuat maintenance request',

                    error:
                        err.message

                });

            }


            res.status(201).json({

                message:
                    'Maintenance request berhasil dibuat',

                id:
                    result.insertId

            });

        }
    );

});


// ========================================
// PUT - Update Status Maintenance
// ========================================

router.put('/:id/status', (req, res) => {

    const { id } = req.params;

    const { status } = req.body;


    // Status yang diperbolehkan

    const allowedStatuses = [

        'PENDING_SUPERVISOR',

        'WAITING_MANAGER_APPROVAL',

        'APPROVED',

        'REJECTED'

    ];


    // Validasi status

    if (
        !status ||
        !allowedStatuses.includes(status)
    ) {

        return res.status(400).json({

            message:
                'Status tidak valid',

            allowedStatuses

        });

    }


    const sql = `
        UPDATE maintenance_requests
        SET status = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [status, id],
        (err, result) => {

            if (err) {

                console.error(
                    'UPDATE STATUS ERROR:',
                    err
                );


                return res.status(500).json({

                    message:
                        'Gagal mengubah status maintenance',

                    error:
                        err.message

                });

            }


            if (
                result.affectedRows === 0
            ) {

                return res.status(404).json({

                    message:
                        'Maintenance request tidak ditemukan'

                });

            }


            res.json({

                success: true,

                message:
                    'Status maintenance berhasil diubah',

                id:
                    Number(id),

                status:
                    status

            });

        }
    );

});


module.exports = router;
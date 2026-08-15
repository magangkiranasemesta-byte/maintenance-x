const express = require('express');
const router = express.Router();

const db = require('../db');


// ========================================
// GET SEMUA EQUIPMENT
// ========================================

router.get('/', (req, res) => {

    const sql = 'SELECT * FROM equipment';

    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                '❌ ERROR DATABASE EQUIPMENT:',
                err
            );

            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data equipment',
                error: err.message
            });
        }

        return res.json(results);

    });

});


// ========================================
// POST TAMBAH EQUIPMENT
// ========================================

router.post('/', (req, res) => {

    const {
        equipment_code,
        name,
        location,
        description,
        status
    } = req.body;


    console.log(
        '📥 POST EQUIPMENT:',
        req.body
    );


    const sql = `
        INSERT INTO equipment
        (
            equipment_code,
            name,
            location,
            description,
            status
        )
        VALUES (?, ?, ?, ?, ?)
    `;


    const values = [
        equipment_code,
        name,
        location,
        description,
        status || 'ACTIVE'
    ];


    db.query(sql, values, (err, result) => {

        if (err) {

            console.error(
                '❌ ERROR INSERT EQUIPMENT:',
                err
            );

            return res.status(500).json({
                success: false,
                message: 'Gagal menambahkan equipment',
                error: err.message
            });

        }


        console.log(
            '✅ EQUIPMENT BERHASIL DITAMBAHKAN:',
            result.insertId
        );


        return res.status(201).json({

            success: true,

            message: 'Equipment berhasil ditambahkan',

            id: result.insertId

        });

    });

});


// ========================================
// DELETE EQUIPMENT
// ========================================

router.delete('/:id', (req, res) => {

    const { id } = req.params;


    console.log(
        `🗑️ DELETE EQUIPMENT ID: ${id}`
    );


    const sql = `
        DELETE FROM equipment
        WHERE id = ?
    `;


    db.query(sql, [id], (err, result) => {

        if (err) {

            console.error(
                '❌ ERROR DELETE EQUIPMENT:',
                err
            );

            return res.status(500).json({

                success: false,

                message: 'Gagal menghapus equipment',

                error: err.message

            });

        }


        // Equipment tidak ditemukan
        if (result.affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message: 'Equipment tidak ditemukan'

            });

        }


        console.log(
            `✅ EQUIPMENT ID ${id} BERHASIL DIHAPUS`
        );


        return res.json({

            success: true,

            message: 'Equipment berhasil dihapus',

            id: id

        });

    });

});


module.exports = router;
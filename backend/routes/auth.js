const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const db = require('../db');


// ========================================
// LOGIN
// ========================================

router.post('/login', (req, res) => {

    const {
        username,
        password
    } = req.body;


    // Validasi
    if (!username || !password) {

        return res.status(400).json({
            success: false,
            message: 'Username dan password wajib diisi'
        });

    }


    const sql = `
        SELECT
            id,
            username,
            email,
            password,
            role
        FROM users
        WHERE username = ?
        LIMIT 1
    `;


    db.query(
        sql,
        [username],
        async (err, results) => {

            if (err) {

                console.error(
                    '❌ ERROR LOGIN:',
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: 'Terjadi kesalahan server'
                });

            }


            // User tidak ditemukan
            if (results.length === 0) {

                return res.status(401).json({
                    success: false,
                    message: 'Username atau password salah'
                });

            }


            const user = results[0];


            // Cek password
            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (!passwordMatch) {

                return res.status(401).json({
                    success: false,
                    message: 'Username atau password salah'
                });

            }


            // Buat JWT
            const token = jwt.sign(

                {
                    id: user.id,
                    username: user.username,
                    role: user.role
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: '8h'
                }

            );


            // Response
            return res.json({

                success: true,

                message: 'Login berhasil',

                token,

                user: {

                    id: user.id,

                    username: user.username,

                    email: user.email,

                    role: user.role

                }

            });

        }
    );

});


module.exports = router;
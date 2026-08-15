const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const db = require('../db');


// ========================================
// REGISTER
// ========================================

router.post('/register', async (req, res) => {

    const {
        username,
        email,
        password,
        confirmPassword
    } = req.body;


    // ========================================
    // VALIDASI INPUT
    // ========================================

    if (
        !username ||
        !email ||
        !password ||
        !confirmPassword
    ) {

        return res.status(400).json({
            success: false,
            message: 'Semua field wajib diisi'
        });

    }


    // ========================================
    // CEK PASSWORD
    // ========================================

    if (password !== confirmPassword) {

        return res.status(400).json({
            success: false,
            message: 'Password dan konfirmasi password tidak sama'
        });

    }


    // ========================================
    // MINIMAL PASSWORD
    // ========================================

    if (password.length < 6) {

        return res.status(400).json({
            success: false,
            message: 'Password minimal 6 karakter'
        });

    }


    // ========================================
    // VALIDASI EMAIL
    // ========================================

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

        return res.status(400).json({
            success: false,
            message: 'Format email tidak valid'
        });

    }


    try {

        // ========================================
        // CEK USERNAME / EMAIL
        // ========================================

        const checkSql = `
            SELECT id
            FROM users
            WHERE username = ?
            OR email = ?
            LIMIT 1
        `;

        db.query(
            checkSql,
            [username, email],
            async (err, results) => {

                if (err) {

                    console.error(
                        '❌ ERROR CHECK REGISTER:',
                        err
                    );

                    return res.status(500).json({
                        success: false,
                        message: 'Terjadi kesalahan server'
                    });

                }


                // ========================================
                // USERNAME / EMAIL SUDAH ADA
                // ========================================

                if (results.length > 0) {

                    return res.status(409).json({
                        success: false,
                        message: 'Username atau email sudah terdaftar'
                    });

                }


                // ========================================
                // HASH PASSWORD
                // ========================================

                const hashedPassword =
                    await bcrypt.hash(
                        password,
                        10
                    );


                // ========================================
                // INSERT USER
                // ========================================

                const insertSql = `
                    INSERT INTO users
                    (
                        username,
                        email,
                        password,
                        role
                    )
                    VALUES (?, ?, ?, ?)
                `;

                db.query(
                    insertSql,
                    [
                        username,
                        email,
                        hashedPassword,
                        'user'
                    ],
                    (err, result) => {

                        if (err) {

                            console.error(
                                '❌ ERROR REGISTER:',
                                err
                            );

                            return res.status(500).json({
                                success: false,
                                message: 'Gagal membuat akun'
                            });

                        }


                        // ========================================
                        // BERHASIL
                        // ========================================

                        return res.status(201).json({

                            success: true,

                            message: 'Registrasi berhasil',

                            user: {

                                id: result.insertId,

                                username,

                                email,

                                role: 'user'

                            }

                        });

                    }
                );

            }
        );

    } catch (error) {

        console.error(
            '❌ ERROR REGISTER:',
            error
        );

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });

    }

});


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


            // ========================================
            // JWT
            // ========================================

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


            // ========================================
            // RESPONSE
            // ========================================

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
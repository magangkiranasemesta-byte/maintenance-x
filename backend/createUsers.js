const bcrypt = require('bcryptjs');
const db = require('./db');

const users = [
    {
        username: 'admin',
        email: 'admin@maintenx.com',
        password: 'admin123',
        role: 'ADMIN'
    },
    {
        username: 'engineer',
        email: 'engineer@maintenx.com',
        password: 'engineer123',
        role: 'ENGINEER'
    },
    {
        username: 'supervisor',
        email: 'supervisor@maintenx.com',
        password: 'supervisor123',
        role: 'SUPERVISOR'
    },
    {
        username: 'manager',
        email: 'manager@maintenx.com',
        password: 'manager123',
        role: 'MANAGER'
    }
];


async function createUsers() {

    for (const user of users) {

        try {

            const hashedPassword = await bcrypt.hash(
                user.password,
                10
            );

            const sql = `
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
                sql,
                [
                    user.username,
                    user.email,
                    hashedPassword,
                    user.role
                ],
                (err) => {

                    if (err) {

                        console.error(
                            `❌ Gagal membuat ${user.username}:`,
                            err.message
                        );

                    } else {

                        console.log(
                            `✅ User ${user.username} berhasil dibuat`
                        );

                    }

                }
            );

        } catch (error) {

            console.error(error);

        }
    }

    setTimeout(() => {
        process.exit();
    }, 1000);
}


createUsers();
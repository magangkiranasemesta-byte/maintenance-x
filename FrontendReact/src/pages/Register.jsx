import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);


    // ========================================
    // HANDLE INPUT
    // ========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };


    // ========================================
    // REGISTER
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');
        setSuccess('');


        // Validasi frontend

        if (
            !formData.username ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword
        ) {

            setError(
                'Semua field wajib diisi'
            );

            return;

        }


        if (
            formData.password !==
            formData.confirmPassword
        ) {

            setError(
                'Password dan konfirmasi password tidak sama'
            );

            return;

        }


        try {

            setLoading(true);


            const response = await fetch(
                'http://localhost:3000/api/auth/register',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(formData)
                }
            );


            const data = await response.json();


            if (!response.ok) {

                setError(
                    data.message ||
                    'Registrasi gagal'
                );

                return;

            }


            // ========================================
            // BERHASIL
            // ========================================

            setSuccess(
                'Registrasi berhasil! Mengarahkan ke login...'
            );


            setFormData({
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
            });


            setTimeout(() => {

                navigate('/login');

            }, 1500);


        } catch (error) {

            console.error(error);

            setError(
                'Tidak dapat terhubung ke server'
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#f5f7fb',
                padding: '20px'
            }}
        >

            <div
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    background: '#ffffff',
                    padding: '35px',
                    borderRadius: '16px',
                    boxShadow:
                        '0 10px 30px rgba(0,0,0,0.08)'
                }}
            >

                {/* HEADER */}

                <div
                    style={{
                        textAlign: 'center',
                        marginBottom: '30px'
                    }}
                >

                    <h1>
                        Create Account
                    </h1>

                    <p
                        style={{
                            color: '#6b7280'
                        }}
                    >
                        Register to Equipment
                        Maintenance System
                    </p>

                </div>


                {/* FORM */}

                <form onSubmit={handleSubmit}>


                    {/* USERNAME */}

                    <div
                        style={{
                            marginBottom: '18px'
                        }}
                    >

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                padding: '12px',
                                marginTop: '7px',
                                border:
                                    '1px solid #d1d5db',
                                borderRadius: '8px'
                            }}
                        />

                    </div>


                    {/* EMAIL */}

                    <div
                        style={{
                            marginBottom: '18px'
                        }}
                    >

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                padding: '12px',
                                marginTop: '7px',
                                border:
                                    '1px solid #d1d5db',
                                borderRadius: '8px'
                            }}
                        />

                    </div>


                    {/* PASSWORD */}

                    <div
                        style={{
                            marginBottom: '18px'
                        }}
                    >

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimum 6 characters"
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                padding: '12px',
                                marginTop: '7px',
                                border:
                                    '1px solid #d1d5db',
                                borderRadius: '8px'
                            }}
                        />

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div
                        style={{
                            marginBottom: '18px'
                        }}
                    >

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                padding: '12px',
                                marginTop: '7px',
                                border:
                                    '1px solid #d1d5db',
                                borderRadius: '8px'
                            }}
                        />

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div
                            style={{
                                background: '#fee2e2',
                                color: '#b91c1c',
                                padding: '12px',
                                borderRadius: '8px',
                                marginBottom: '15px',
                                fontSize: '14px'
                            }}
                        >
                            {error}
                        </div>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <div
                            style={{
                                background: '#dcfce7',
                                color: '#15803d',
                                padding: '12px',
                                borderRadius: '8px',
                                marginBottom: '15px',
                                fontSize: '14px'
                            }}
                        >
                            {success}
                        </div>

                    )}


                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '13px',
                            border: 'none',
                            borderRadius: '8px',
                            background: '#2563eb',
                            color: '#ffffff',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >

                        {loading
                            ? 'Creating Account...'
                            : 'Create Account'
                        }

                    </button>

                </form>


                {/* LOGIN */}

                <div
                    style={{
                        textAlign: 'center',
                        marginTop: '25px',
                        fontSize: '14px'
                    }}
                >

                    Already have an account?

                    {' '}

                    <Link
                        to="/login"
                        style={{
                            color: '#2563eb',
                            fontWeight: '600'
                        }}
                    >
                        Login
                    </Link>

                </div>

            </div>

        </div>

    );

};

export default Register;
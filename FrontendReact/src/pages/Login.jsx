import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Lock,
    User,
    Eye,
    EyeOff,
    Wrench
} from "lucide-react";

const API = "http://localhost:3000";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));

        setError("");

    };


    // =========================
    // LOGIN
    // =========================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await fetch(
                `${API}/api/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username: form.username,
                        password: form.password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Username atau password salah"
                );

            }


            // =========================
            // SIMPAN LOGIN
            // =========================

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            console.log(
                "Login berhasil:",
                data.user
            );


            // =========================
            // MASUK DASHBOARD
            // =========================

            navigate("/");


        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );

            setError(
                error.message ||
                "Gagal menghubungkan ke server"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="login-page">

            <div className="login-container">


                {/* =========================
                    LEFT SIDE
                ========================= */}

                <div className="login-brand">

                    <div className="brand-logo">
                        <Wrench size={30} />
                    </div>

                    <h1>
                        MaintenX
                    </h1>

                    <p>
                        Maintenance Management System
                    </p>

                    <div className="brand-description">

                        <span>
                            Sistem manajemen maintenance
                        </span>

                        <span>
                            untuk memantau dan mengelola
                        </span>

                        <span>
                            equipment perusahaan.
                        </span>

                    </div>

                </div>


                {/* =========================
                    RIGHT SIDE
                ========================= */}

                <div className="login-form-container">

                    <div className="login-header">

                        <h2>
                            Selamat Datang
                        </h2>

                        <p>
                            Silakan login untuk melanjutkan
                        </p>

                    </div>


                    {/* =========================
                        ERROR
                    ========================= */}

                    {error && (

                        <div className="login-error">
                            {error}
                        </div>

                    )}


                    {/* =========================
                        LOGIN FORM
                    ========================= */}

                    <form
                        onSubmit={handleSubmit}
                        className="login-form"
                    >


                        {/* =========================
                            USERNAME
                        ========================= */}

                        <div className="login-field">

                            <label>
                                Username
                            </label>

                            <div className="login-input-wrapper">

                                <User
                                    size={18}
                                    className="login-input-icon"
                                />

                                <input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder="Masukkan username"
                                    autoComplete="username"
                                    required
                                />

                            </div>

                        </div>


                        {/* =========================
                            PASSWORD
                        ========================= */}

                        <div className="login-field">

                            <label>
                                Password
                            </label>

                            <div className="login-input-wrapper">

                                <Lock
                                    size={18}
                                    className="login-input-icon"
                                />

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Masukkan password"
                                    autoComplete="current-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >

                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}

                                </button>

                            </div>

                        </div>


                        {/* =========================
                            LOGIN BUTTON
                        ========================= */}

                        <button
                            type="submit"
                            className="login-submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Memproses..."
                                : "Login"
                            }

                        </button>


                    </form>


                    {/* =========================
                        REGISTER
                    ========================= */}

                    <div className="login-register">

                        <span>
                            Belum punya akun?
                        </span>

                        <Link to="/register">
                            Register
                        </Link>

                    </div>


                    {/* =========================
                        DEMO ACCOUNT
                    ========================= */}

                    <div className="login-demo">

                        <p>
                            Demo Account
                        </p>

                        <div>
                            Admin: <strong>admin</strong> / admin123
                        </div>

                        <div>
                            Engineer: <strong>engineer</strong> / engineer123
                        </div>

                        <div>
                            Supervisor: <strong>supervisor</strong> / supervisor123
                        </div>

                        <div>
                            Manager: <strong>manager</strong> / manager123
                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;
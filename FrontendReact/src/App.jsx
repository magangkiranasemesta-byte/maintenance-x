import {
    BrowserRouter,
    Routes,
    Route,
    Outlet
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Equipment from "./pages/Equipment";
import Maintenance from "./pages/Maintenance";
import Approval from "./pages/Approval";
import History from "./pages/History";


// =========================
// LAYOUT SETELAH LOGIN
// =========================

function MainLayout() {

    return (
        <div className="app-layout">

            <Sidebar />

            <main className="main-content">
                <Outlet />
            </main>

        </div>
    );
}


// =========================
// APP
// =========================

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =====================
                    LOGIN
                ===================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =====================
                    HALAMAN YANG DILINDUNGI
                ===================== */}

                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >

                    {/* =====================
                        DASHBOARD
                    ===================== */}

                    <Route
                        path="/"
                        element={
                            <RoleRoute permission="dashboard">
                                <Dashboard />
                            </RoleRoute>
                        }
                    />


                    {/* =====================
                        EQUIPMENT
                    ===================== */}

                    <Route
                        path="/equipment"
                        element={
                            <RoleRoute permission="equipment">
                                <Equipment />
                            </RoleRoute>
                        }
                    />


                    {/* =====================
                        MAINTENANCE
                    ===================== */}

                    <Route
                        path="/maintenance"
                        element={
                            <RoleRoute permission="maintenance">
                                <Maintenance />
                            </RoleRoute>
                        }
                    />


                    {/* =====================
                        APPROVAL
                    ===================== */}

                    <Route
                        path="/approval"
                        element={
                            <RoleRoute permission="approval">
                                <Approval />
                            </RoleRoute>
                        }
                    />


                    {/* =====================
                        HISTORY
                    ===================== */}

                    <Route
                        path="/history"
                        element={
                            <RoleRoute permission="history">
                                <History />
                            </RoleRoute>
                        }
                    />

                </Route>


                {/* =====================
                    UNAUTHORIZED
                ===================== */}

                <Route
                    path="/unauthorized"
                    element={
                        <div className="unauthorized-page">

                            <div className="unauthorized-card">

                                <h1>403</h1>

                                <h2>
                                    Access Denied
                                </h2>

                                <p>
                                    Anda tidak memiliki akses
                                    ke halaman ini.
                                </p>

                                <button
                                    onClick={() =>
                                        window.history.back()
                                    }
                                >
                                    Kembali
                                </button>

                            </div>

                        </div>
                    }
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;
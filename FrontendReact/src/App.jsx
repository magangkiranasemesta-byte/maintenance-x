import {
    BrowserRouter,
    Routes,
    Route,
    Outlet
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
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

                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/equipment"
                        element={<Equipment />}
                    />

                    <Route
                        path="/maintenance"
                        element={<Maintenance />}
                    />

                    <Route
                        path="/approval"
                        element={<Approval />}
                    />

                    <Route
                        path="/history"
                        element={<History />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>

    );
}

export default App;
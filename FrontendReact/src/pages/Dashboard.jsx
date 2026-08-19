import React from "react";

import AdminDashboard from "../components/dashboard/AdminDashboard";
import EngineerDashboard from "../components/dashboard/EngineerDashboard";
import SupervisorDashboard from "../components/dashboard/SupervisorDashboard";
import ManagerDashboard from "../components/dashboard/ManagerDashboard";

const Dashboard = () => {

    const storedUser = localStorage.getItem("user");

    let user = null;

    try {
        user = storedUser
            ? JSON.parse(storedUser)
            : null;
    } catch (error) {
        console.error(
            "Gagal membaca user:",
            error
        );
    }

    const role = user?.role?.toLowerCase();

    if (role === "admin") {
        return <AdminDashboard />;
    }

    if (role === "engineer") {
        return <EngineerDashboard />;
    }

    if (role === "supervisor") {
        return <SupervisorDashboard />;
    }

    if (role === "manager") {
        return <ManagerDashboard />;
    }

    return (
        <div className="dashboard-empty">

            <div className="empty-icon">
                🔒
            </div>

            <h2>
                Dashboard tidak tersedia
            </h2>

            <p>
                Role pengguna tidak dikenali.
            </p>

        </div>
    );
};

export default Dashboard;
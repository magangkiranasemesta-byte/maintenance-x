import {
    LayoutDashboard,
    Package,
    Wrench,
    Check,
    History,
    LogOut
} from "lucide-react";

import {
    NavLink,
    useNavigate
} from "react-router-dom";

import { rolePermissions } from "../config/permissions";


const menuItems = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/",
        permission: "dashboard"
    },
    {
        label: "Equipment",
        icon: Package,
        path: "/equipment",
        permission: "equipment"
    },
    {
        label: "Maintenance",
        icon: Wrench,
        path: "/maintenance",
        permission: "maintenance"
    },
    {
        label: "Approval",
        icon: Check,
        path: "/approval",
        permission: "approval"
    },
    {
        label: "History",
        icon: History,
        path: "/history",
        permission: "history"
    }
];


function Sidebar() {

    // =========================
    // NAVIGATE
    // =========================

    const navigate = useNavigate();


    // =========================
    // USER LOGIN
    // =========================

    const userData = localStorage.getItem("user");

    let user = null;

    try {

        user = userData
            ? JSON.parse(userData)
            : null;

    } catch (error) {

        console.error(
            "Gagal membaca data user:",
            error
        );

    }


    // =========================
    // ROLE
    // =========================

    const role = user?.role?.toLowerCase();

    const permissions =
        rolePermissions[role];


    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/login", {
            replace: true
        });

    };


    return (

        <aside className="sidebar">

            {/* =========================
                BRAND
            ========================= */}

            <div className="brand">

                <div className="brand-logo">
                    M
                </div>

                <div className="brand-text">

                    <h2>
                        MaintenX
                    </h2>

                    <p>
                        Maintenance System
                    </p>

                </div>

            </div>


            {/* =========================
                MENU
            ========================= */}

            <nav className="navigation">

                <p className="menu-title">
                    MENU
                </p>


                {menuItems
                    .filter(
                        item =>
                            permissions?.[item.permission]
                    )
                    .map((item) => {

                        const Icon = item.icon;

                        return (

                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `nav-item ${
                                        isActive
                                            ? "active"
                                            : ""
                                    }`
                                }
                            >

                                <span className="nav-icon">

                                    <Icon size={16} />

                                </span>

                                <span>
                                    {item.label}
                                </span>

                            </NavLink>

                        );

                    })}

            </nav>


            {/* =========================
                FOOTER
            ========================= */}

            <div className="sidebar-footer">

                <button
                    type="button"
                    className="logout-btn"
                    onClick={handleLogout}
                >

                    <LogOut size={15} />

                    <span>
                        Logout
                    </span>

                </button>

            </div>

        </aside>

    );

}


export default Sidebar;
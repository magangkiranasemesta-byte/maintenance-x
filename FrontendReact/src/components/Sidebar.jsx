import {
    LayoutDashboard,
    Package,
    Wrench,
    Check,
    History,
    LogOut
} from "lucide-react";

import {
    NavLink
} from "react-router-dom";

const menuItems = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/"
    },
    {
        label: "Equipment",
        icon: Package,
        path: "/equipment"
    },
    {
        label: "Maintenance",
        icon: Wrench,
        path: "/maintenance"
    },
    {
        label: "Approval",
        icon: Check,
        path: "/approval"
    },
    {
        label: "History",
        icon: History,
        path: "/history"
    }
];

function Sidebar() {

    return (

        <aside className="sidebar">

            {/* BRAND */}

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


            {/* MENU */}

            <nav className="navigation">

                <p className="menu-title">
                    MENU
                </p>


                {menuItems.map((item) => {

                    const Icon = item.icon;

                    return (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `nav-item ${
                                    isActive ? "active" : ""
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


            {/* FOOTER */}

            <div className="sidebar-footer">

                <button className="logout-btn">

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
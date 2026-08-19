import React from "react";

import {
    Package,
    Wrench,
    CheckCircle,
    Clock,
    AlertTriangle,
    Activity,
    Users,
    Settings
} from "lucide-react";

import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";

const AdminDashboard = () => {

    const recentActivities = [
        {
            id: 1,
            title: "Maintenance request created",
            description: "CNC Machine - CNC-001",
            time: "10 minutes ago",
            type: "Maintenance"
        },
        {
            id: 2,
            title: "Equipment updated",
            description: "Generator GEN-002",
            time: "25 minutes ago",
            type: "Equipment"
        },
        {
            id: 3,
            title: "Maintenance approved",
            description: "Compressor CMP-004",
            time: "1 hour ago",
            type: "Approval"
        },
        {
            id: 4,
            title: "New engineer added",
            description: "User: Ahmad Fauzan",
            time: "2 hours ago",
            type: "User"
        }
    ];

    const equipmentStatus = [
        {
            name: "Good",
            value: 95,
            className: "good"
        },
        {
            name: "Warning",
            value: 15,
            className: "warning"
        },
        {
            name: "Critical",
            value: 10,
            className: "critical"
        }
    ];

    return (
        <div className="role-dashboard">

            {/* HEADER */}

            <div className="dashboard-header">

                <div>
                    <p className="dashboard-label">
                        ADMIN PANEL
                    </p>

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p className="dashboard-description">
                        Monitor seluruh aktivitas equipment
                        dan maintenance system.
                    </p>
                </div>

                <div className="dashboard-date">
                    <Activity size={18} />
                    <span>System Overview</span>
                </div>

            </div>


            {/* STAT CARDS */}

            <div className="dashboard-stat-grid">

                <StatCard
                    title="Total Equipment"
                    value="120"
                    subtitle="Registered equipment"
                    icon={<Package size={24} />}
                    variant="blue"
                />

                <StatCard
                    title="Active Maintenance"
                    value="18"
                    subtitle="Currently in progress"
                    icon={<Wrench size={24} />}
                    variant="orange"
                />

                <StatCard
                    title="Pending Approval"
                    value="5"
                    subtitle="Need supervisor review"
                    icon={<Clock size={24} />}
                    variant="purple"
                />

                <StatCard
                    title="Completed"
                    value="87"
                    subtitle="Maintenance completed"
                    icon={<CheckCircle size={24} />}
                    variant="green"
                />

            </div>


            {/* MAIN GRID */}

            <div className="dashboard-two-column">

                {/* EQUIPMENT STATUS */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>
                            <h3>Equipment Status</h3>

                            <p>
                                Current equipment condition
                            </p>
                        </div>

                        <Package size={20} />

                    </div>


                    <div className="equipment-status-list">

                        {equipmentStatus.map((item) => (

                            <div
                                className="equipment-status-item"
                                key={item.name}
                            >

                                <div className="equipment-status-info">

                                    <span
                                        className={`status-dot ${item.className}`}
                                    />

                                    <span>
                                        {item.name}
                                    </span>

                                </div>

                                <strong>
                                    {item.value}
                                </strong>

                            </div>

                        ))}

                    </div>

                </div>


                {/* MAINTENANCE SUMMARY */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>
                            <h3>Maintenance Summary</h3>

                            <p>
                                Current maintenance progress
                            </p>
                        </div>

                        <Wrench size={20} />

                    </div>


                    <div className="progress-container">

                        <div className="progress-row">

                            <div>
                                <span>
                                    Scheduled
                                </span>

                                <strong>
                                    12
                                </strong>
                            </div>

                            <div className="progress-bar">
                                <span
                                    style={{ width: "65%" }}
                                />
                            </div>

                        </div>


                        <div className="progress-row">

                            <div>
                                <span>
                                    On Progress
                                </span>

                                <strong>
                                    8
                                </strong>
                            </div>

                            <div className="progress-bar">
                                <span
                                    style={{ width: "45%" }}
                                />
                            </div>

                        </div>


                        <div className="progress-row">

                            <div>
                                <span>
                                    Completed
                                </span>

                                <strong>
                                    87
                                </strong>
                            </div>

                            <div className="progress-bar">
                                <span
                                    style={{ width: "90%" }}
                                />
                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* RECENT ACTIVITY */}

            <div className="dashboard-card">

                <div className="card-header">

                    <div>
                        <h3>
                            Recent Activity
                        </h3>

                        <p>
                            Latest system activities
                        </p>
                    </div>

                    <Activity size={20} />

                </div>


                <div className="activity-list">

                    {recentActivities.map((activity) => (

                        <div
                            className="activity-item"
                            key={activity.id}
                        >

                            <div className="activity-icon">
                                <Activity size={17} />
                            </div>

                            <div className="activity-content">

                                <strong>
                                    {activity.title}
                                </strong>

                                <p>
                                    {activity.description}
                                </p>

                            </div>

                            <div className="activity-meta">

                                <StatusBadge
                                    status={activity.type}
                                />

                                <span>
                                    {activity.time}
                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            </div>


            {/* ADMIN QUICK INFO */}

            <div className="dashboard-admin-footer">

                <div>
                    <Users size={20} />

                    <div>
                        <strong>
                            24 Users
                        </strong>

                        <span>
                            Active system users
                        </span>
                    </div>
                </div>


                <div>
                    <Settings size={20} />

                    <div>
                        <strong>
                            System Status
                        </strong>

                        <span className="system-online">
                            ● All systems operational
                        </span>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default AdminDashboard;
import React from "react";

import {
    CheckSquare,
    Clock,
    Wrench,
    Users,
    TrendingUp,
    AlertTriangle
} from "lucide-react";

import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";

const SupervisorDashboard = () => {

    const approvalRequests = [
        {
            id: "MT-021",
            equipment: "CNC Machine",
            engineer: "Andi",
            status: "Pending"
        },
        {
            id: "MT-022",
            equipment: "Generator",
            engineer: "Budi",
            status: "Pending"
        },
        {
            id: "MT-023",
            equipment: "Compressor",
            engineer: "Deni",
            status: "Approved"
        }
    ];

    const engineers = [
        {
            name: "Andi",
            tasks: 8,
            completion: 85
        },
        {
            name: "Budi",
            tasks: 10,
            completion: 92
        },
        {
            name: "Deni",
            tasks: 6,
            completion: 78
        }
    ];

    return (
        <div className="role-dashboard">

            {/* HEADER */}

            <div className="dashboard-header">

                <div>

                    <p className="dashboard-label">
                        SUPERVISOR PANEL
                    </p>

                    <h1>
                        Supervisor Dashboard
                    </h1>

                    <p className="dashboard-description">
                        Monitor team performance,
                        maintenance progress and approvals.
                    </p>

                </div>

                <div className="dashboard-date">
                    <Users size={18} />
                    <span>
                        Team Overview
                    </span>
                </div>

            </div>


            {/* STAT */}

            <div className="dashboard-stat-grid">

                <StatCard
                    title="Maintenance Requests"
                    value="14"
                    subtitle="Total requests"
                    icon={<Wrench size={24} />}
                    variant="blue"
                />

                <StatCard
                    title="Pending Approval"
                    value="5"
                    subtitle="Waiting for review"
                    icon={<Clock size={24} />}
                    variant="orange"
                />

                <StatCard
                    title="On Progress"
                    value="7"
                    subtitle="Currently active"
                    icon={<TrendingUp size={24} />}
                    variant="purple"
                />

                <StatCard
                    title="Completed"
                    value="42"
                    subtitle="Completed maintenance"
                    icon={<CheckSquare size={24} />}
                    variant="green"
                />

            </div>


            {/* APPROVAL */}

            <div className="dashboard-card">

                <div className="card-header">

                    <div>
                        <h3>
                            Approval Requests
                        </h3>

                        <p>
                            Maintenance requests requiring review
                        </p>
                    </div>

                    <CheckSquare size={20} />

                </div>


                <div className="maintenance-table-wrapper">

                    <table className="maintenance-table">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Equipment</th>
                                <th>Engineer</th>
                                <th>Status</th>
                            </tr>

                        </thead>

                        <tbody>

                            {approvalRequests.map((request) => (

                                <tr key={request.id}>

                                    <td>
                                        <strong>
                                            {request.id}
                                        </strong>
                                    </td>

                                    <td>
                                        {request.equipment}
                                    </td>

                                    <td>
                                        {request.engineer}
                                    </td>

                                    <td>
                                        <StatusBadge
                                            status={request.status}
                                        />
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* TEAM + PROGRESS */}

            <div className="dashboard-two-column">

                {/* ENGINEER PERFORMANCE */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>
                            <h3>
                                Engineer Performance
                            </h3>

                            <p>
                                Team maintenance performance
                            </p>
                        </div>

                        <Users size={20} />

                    </div>


                    <div className="engineer-performance">

                        {engineers.map((engineer) => (

                            <div
                                className="engineer-performance-item"
                                key={engineer.name}
                            >

                                <div className="engineer-info">

                                    <div className="avatar">
                                        {engineer.name.charAt(0)}
                                    </div>

                                    <div>
                                        <strong>
                                            {engineer.name}
                                        </strong>

                                        <span>
                                            {engineer.tasks} active tasks
                                        </span>
                                    </div>

                                </div>


                                <div className="performance-value">
                                    {engineer.completion}%
                                </div>

                            </div>

                        ))}

                    </div>

                </div>


                {/* MAINTENANCE PROGRESS */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>
                            <h3>
                                Maintenance Progress
                            </h3>

                            <p>
                                Overall team progress
                            </p>
                        </div>

                        <TrendingUp size={20} />

                    </div>


                    <div className="large-progress">

                        <div className="large-progress-header">

                            <span>
                                Overall Completion
                            </span>

                            <strong>
                                75%
                            </strong>

                        </div>

                        <div className="large-progress-bar">

                            <span
                                style={{
                                    width: "75%"
                                }}
                            />

                        </div>

                    </div>


                    <div className="progress-stats">

                        <div>
                            <strong>
                                42
                            </strong>

                            <span>
                                Completed
                            </span>
                        </div>

                        <div>
                            <strong>
                                7
                            </strong>

                            <span>
                                On Progress
                            </span>
                        </div>

                        <div>
                            <strong>
                                5
                            </strong>

                            <span>
                                Pending
                            </span>
                        </div>

                    </div>

                </div>

            </div>


            {/* ALERT */}

            <div className="dashboard-alert">

                <AlertTriangle size={20} />

                <div>

                    <strong>
                        Attention Required
                    </strong>

                    <p>
                        There are 5 maintenance requests
                        waiting for approval.
                    </p>

                </div>

            </div>

        </div>
    );
};

export default SupervisorDashboard;
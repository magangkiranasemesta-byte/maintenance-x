import React from "react";

import {
    Wrench,
    CalendarDays,
    CheckCircle,
    Clock,
    AlertTriangle,
    Package,
    ClipboardList
} from "lucide-react";

import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";

const EngineerDashboard = () => {

    const maintenanceTasks = [
        {
            id: "MT-001",
            equipment: "CNC Machine",
            code: "CNC-001",
            type: "Preventive",
            status: "On Progress",
            priority: "High"
        },
        {
            id: "MT-002",
            equipment: "Compressor",
            code: "CMP-004",
            type: "Repair",
            status: "Scheduled",
            priority: "Medium"
        },
        {
            id: "MT-003",
            equipment: "Generator",
            code: "GEN-002",
            type: "Inspection",
            status: "Urgent",
            priority: "Critical"
        }
    ];

    const schedules = [
        {
            time: "09:00",
            equipment: "CNC Machine",
            task: "Preventive Maintenance"
        },
        {
            time: "13:00",
            equipment: "Compressor",
            task: "Repair"
        },
        {
            time: "15:00",
            equipment: "Generator",
            task: "Inspection"
        }
    ];

    return (
        <div className="role-dashboard">

            {/* HEADER */}

            <div className="dashboard-header">

                <div>

                    <p className="dashboard-label">
                        ENGINEER PANEL
                    </p>

                    <h1>
                        Engineer Dashboard
                    </h1>

                    <p className="dashboard-description">
                        Monitor your maintenance tasks
                        and today's schedule.
                    </p>

                </div>

                <div className="dashboard-date">
                    <CalendarDays size={18} />
                    <span>
                        Today's Work
                    </span>
                </div>

            </div>


            {/* STAT */}

            <div className="dashboard-stat-grid">

                <StatCard
                    title="My Tasks"
                    value="8"
                    subtitle="Assigned maintenance"
                    icon={<ClipboardList size={24} />}
                    variant="blue"
                />

                <StatCard
                    title="Scheduled"
                    value="3"
                    subtitle="Today's schedule"
                    icon={<CalendarDays size={24} />}
                    variant="purple"
                />

                <StatCard
                    title="On Progress"
                    value="2"
                    subtitle="Currently working"
                    icon={<Wrench size={24} />}
                    variant="orange"
                />

                <StatCard
                    title="Completed"
                    value="15"
                    subtitle="Completed tasks"
                    icon={<CheckCircle size={24} />}
                    variant="green"
                />

            </div>


            {/* TASKS */}

            <div className="dashboard-card">

                <div className="card-header">

                    <div>
                        <h3>
                            My Maintenance Tasks
                        </h3>

                        <p>
                            Maintenance assigned to you
                        </p>
                    </div>

                    <Wrench size={20} />

                </div>


                <div className="maintenance-table-wrapper">

                    <table className="maintenance-table">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Equipment</th>
                                <th>Type</th>
                                <th>Priority</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            {maintenanceTasks.map((task) => (

                                <tr key={task.id}>

                                    <td>
                                        <strong>
                                            {task.id}
                                        </strong>
                                    </td>

                                    <td>
                                        <div className="equipment-cell">

                                            <Package size={17} />

                                            <div>
                                                <strong>
                                                    {task.equipment}
                                                </strong>

                                                <span>
                                                    {task.code}
                                                </span>
                                            </div>

                                        </div>
                                    </td>

                                    <td>
                                        {task.type}
                                    </td>

                                    <td>
                                        <StatusBadge
                                            status={task.priority}
                                        />
                                    </td>

                                    <td>
                                        <StatusBadge
                                            status={task.status}
                                        />
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* TWO COLUMN */}

            <div className="dashboard-two-column">

                {/* TODAY'S SCHEDULE */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>
                            <h3>
                                Today's Schedule
                            </h3>

                            <p>
                                Your maintenance schedule
                            </p>
                        </div>

                        <CalendarDays size={20} />

                    </div>


                    <div className="schedule-list">

                        {schedules.map((schedule, index) => (

                            <div
                                className="schedule-item"
                                key={index}
                            >

                                <div className="schedule-time">
                                    {schedule.time}
                                </div>

                                <div className="schedule-line" />

                                <div className="schedule-content">

                                    <strong>
                                        {schedule.equipment}
                                    </strong>

                                    <span>
                                        {schedule.task}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>


                {/* EQUIPMENT ISSUES */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>
                            <h3>
                                Equipment Issues
                            </h3>

                            <p>
                                Equipment requiring attention
                            </p>
                        </div>

                        <AlertTriangle size={20} />

                    </div>


                    <div className="issue-list">

                        <div className="issue-item">

                            <div>
                                <strong>
                                    CNC-001
                                </strong>

                                <span>
                                    CNC Machine
                                </span>
                            </div>

                            <StatusBadge status="Warning" />

                        </div>


                        <div className="issue-item">

                            <div>
                                <strong>
                                    GEN-002
                                </strong>

                                <span>
                                    Generator
                                </span>
                            </div>

                            <StatusBadge status="Critical" />

                        </div>


                        <div className="issue-item">

                            <div>
                                <strong>
                                    CMP-004
                                </strong>

                                <span>
                                    Compressor
                                </span>
                            </div>

                            <StatusBadge status="Warning" />

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default EngineerDashboard;
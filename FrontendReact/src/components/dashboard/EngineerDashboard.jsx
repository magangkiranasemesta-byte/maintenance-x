import React, { useState } from "react";

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

    // ==============================
    // TODAY'S WORK MODAL
    // ==============================
    const [showTodayWork, setShowTodayWork] = useState(false);

    // ==============================
    // MAINTENANCE TASKS
    // ==============================
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

    // ==============================
    // TODAY'S SCHEDULE
    // ==============================
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

            {/* =====================================
                HEADER
            ===================================== */}
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


                {/* =====================================
                    TODAY'S WORK BUTTON
                ===================================== */}
                <button
                    type="button"
                    className="dashboard-date"
                    onClick={() => setShowTodayWork(true)}
                >
                    <CalendarDays size={18} />

                    <span>
                        Today's Work
                    </span>
                </button>

            </div>


            {/* =====================================
                STAT
            ===================================== */}
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


            {/* =====================================
                MAINTENANCE TASKS
            ===================================== */}
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

                                <th>
                                    ID
                                </th>

                                <th>
                                    Equipment
                                </th>

                                <th>
                                    Type
                                </th>

                                <th>
                                    Priority
                                </th>

                                <th>
                                    Status
                                </th>

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


            {/* =====================================
                TWO COLUMN
            ===================================== */}
            <div className="dashboard-two-column">


                {/* =================================
                    TODAY'S SCHEDULE
                ================================= */}
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


                {/* =================================
                    EQUIPMENT ISSUES
                ================================= */}
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

                            <StatusBadge
                                status="Warning"
                            />

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

                            <StatusBadge
                                status="Critical"
                            />

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

                            <StatusBadge
                                status="Warning"
                            />

                        </div>


                    </div>

                </div>

            </div>


            {/* =====================================
                TODAY'S WORK MODAL
            ===================================== */}
            {showTodayWork && (

                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0, 0, 0, 0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        padding: "20px"
                    }}

                    onClick={() => setShowTodayWork(false)}
                >

                    {/* =================================
                        MODAL CONTENT
                    ================================= */}
                    <div
                        style={{
                            background: "#ffffff",
                            width: "100%",
                            maxWidth: "600px",
                            maxHeight: "80vh",
                            overflowY: "auto",
                            borderRadius: "16px",
                            padding: "24px",
                            boxShadow:
                                "0 20px 50px rgba(0,0,0,0.2)"
                        }}

                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >

                        {/* =============================
                            MODAL HEADER
                        ============================= */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "20px"
                            }}
                        >

                            <div>

                                <h2
                                    style={{
                                        margin: 0
                                    }}
                                >
                                    Today's Work
                                </h2>

                                <p
                                    style={{
                                        margin:
                                            "6px 0 0",
                                        color: "#64748b"
                                    }}
                                >
                                    Your maintenance
                                    schedule for today
                                </p>

                            </div>


                            {/* CLOSE BUTTON */}
                            <button
                                type="button"
                                onClick={() =>
                                    setShowTodayWork(false)
                                }
                                style={{
                                    border: "none",
                                    background:
                                        "transparent",
                                    fontSize: "28px",
                                    cursor: "pointer",
                                    color: "#64748b",
                                    lineHeight: 1
                                }}
                            >
                                ×
                            </button>

                        </div>


                        {/* =============================
                            EMPTY STATE
                        ============================= */}
                        {schedules.length === 0 ? (

                            <div
                                style={{
                                    textAlign: "center",
                                    padding:
                                        "40px 20px",
                                    color: "#64748b"
                                }}
                            >

                                <CalendarDays
                                    size={40}
                                    style={{
                                        marginBottom:
                                            "10px"
                                    }}
                                />

                                <h3>
                                    No work scheduled
                                    for today
                                </h3>

                                <p>
                                    There are no
                                    maintenance
                                    activities
                                    scheduled for
                                    today.
                                </p>

                            </div>

                        ) : (

                            /* =========================
                               TODAY'S WORK LIST
                            ========================= */
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection:
                                        "column",
                                    gap: "12px"
                                }}
                            >

                                {schedules.map(
                                    (
                                        schedule,
                                        index
                                    ) => (

                                        <div
                                            key={index}
                                            style={{
                                                display:
                                                    "flex",
                                                gap: "16px",
                                                alignItems:
                                                    "center",
                                                padding:
                                                    "16px",
                                                border:
                                                    "1px solid #e2e8f0",
                                                borderRadius:
                                                    "12px",
                                                background:
                                                    "#f8fafc"
                                            }}
                                        >

                                            {/* TIME */}
                                            <div
                                                style={{
                                                    minWidth:
                                                        "60px",
                                                    fontWeight:
                                                        "700",
                                                    color:
                                                        "#334155"
                                                }}
                                            >
                                                {
                                                    schedule.time
                                                }
                                            </div>


                                            {/* WORK INFO */}
                                            <div
                                                style={{
                                                    flex: 1
                                                }}
                                            >

                                                <strong
                                                    style={{
                                                        display:
                                                            "block",
                                                        marginBottom:
                                                            "4px"
                                                    }}
                                                >
                                                    {
                                                        schedule.equipment
                                                    }
                                                </strong>

                                                <span
                                                    style={{
                                                        color:
                                                            "#64748b"
                                                    }}
                                                >
                                                    {
                                                        schedule.task
                                                    }
                                                </span>

                                            </div>


                                            {/* CLOCK ICON */}
                                            <Clock
                                                size={20}
                                                color="#64748b"
                                            />

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
};

export default EngineerDashboard;

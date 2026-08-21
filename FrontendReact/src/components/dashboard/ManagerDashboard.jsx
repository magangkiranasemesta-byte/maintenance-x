import React, { useState } from "react";

import {
    BarChart3,
    Package,
    TrendingUp,
    DollarSign,
    CheckCircle,
    Activity,
    AlertTriangle,
    Clock,
    Wrench,
    XCircle
} from "lucide-react";

import StatCard from "./StatCard";


const ManagerDashboard = () => {

    // ======================================================
    // STATE
    // ======================================================

    const [selectedChart, setSelectedChart] =
        useState("maintenance");


    // ======================================================
    // DATA
    // ======================================================

    const maintenanceTrend = [
        {
            month: "Jan",
            value: 55
        },
        {
            month: "Feb",
            value: 70
        },
        {
            month: "Mar",
            value: 48
        },
        {
            month: "Apr",
            value: 82
        },
        {
            month: "May",
            value: 92
        },
        {
            month: "Jun",
            value: 88
        }
    ];


    const maintenanceStatus = [
        {
            label: "Completed",
            value: 92,
            count: 92,
            className: "completed"
        },
        {
            label: "In Progress",
            value: 68,
            count: 68,
            className: "progress"
        },
        {
            label: "Pending",
            value: 24,
            count: 24,
            className: "pending"
        },
        {
            label: "Rejected",
            value: 8,
            count: 8,
            className: "rejected"
        }
    ];


    const equipmentHealth = [
        {
            label: "Good",
            count: 95,
            percentage: 79,
            className: "good"
        },
        {
            label: "Warning",
            count: 15,
            percentage: 13,
            className: "warning"
        },
        {
            label: "Critical",
            count: 10,
            percentage: 8,
            className: "critical"
        }
    ];


    const kpiPerformance = [
        {
            label: "Completion Rate",
            value: 92,
            target: 90,
            icon: <CheckCircle size={20} />
        },
        {
            label: "Equipment Uptime",
            value: 94.5,
            target: 90,
            icon: <Activity size={20} />
        },
        {
            label: "On-Time Maintenance",
            value: 88,
            target: 85,
            icon: <Clock size={20} />
        }
    ];


    // ======================================================
    // MAX TREND
    // ======================================================

    const maxTrendValue =
        Math.max(
            ...maintenanceTrend.map(
                item => item.value
            )
        );


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <div className="role-dashboard">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="dashboard-header">

                <div>

                    <p className="dashboard-label">
                        MANAGEMENT PANEL
                    </p>


                    <h1>
                        Manager Dashboard
                    </h1>


                    <p className="dashboard-description">
                        Monitor maintenance performance
                        and operational KPI.
                    </p>

                </div>


                <div className="dashboard-date">

                    <BarChart3 size={18} />

                    <span>
                        Performance Overview
                    </span>

                </div>

            </div>


            {/* ==================================================
                KPI STATISTICS
            ================================================== */}

            <div className="dashboard-stat-grid">


                {/* TOTAL EQUIPMENT */}

                <StatCard
                    title="Total Equipment"
                    value="120"
                    subtitle="Registered assets"
                    icon={
                        <Package
                            size={24}
                        />
                    }
                    variant="blue"
                />


                {/* EQUIPMENT UPTIME */}

                <StatCard
                    title="Equipment Uptime"
                    value="94.5%"
                    subtitle="+2.4% this month"
                    icon={
                        <Activity
                            size={24}
                        />
                    }
                    variant="green"
                />


                {/* COMPLETION RATE */}

                <StatCard
                    title="Completion Rate"
                    value="92%"
                    subtitle="+4.2% this month"
                    icon={
                        <CheckCircle
                            size={24}
                        />
                    }
                    variant="purple"
                />


                {/* MAINTENANCE COST

                <StatCard
                    title="Maintenance Cost"
                    value="Rp 24.5M"
                    subtitle="This month"
                    icon={
                        <DollarSign
                            size={24}
                        />
                    }
                    variant="orange"
                /> */}

            </div>


            {/* ==================================================
                KPI PERFORMANCE
            ================================================== */}

            <div
                className="dashboard-card"
                style={{
                    marginTop: "20px"
                }}
            >

                <div className="card-header">

                    <div>

                        <h3>
                            Maintenance Performance
                        </h3>

                        <p>
                            Key performance indicators
                        </p>

                    </div>


                    <TrendingUp
                        size={20}
                    />

                </div>


                <div
                    className="manager-kpi-grid"
                    style={{
                        marginTop: "20px"
                    }}
                >


                    {/* COMPLETION */}

                    <div className="manager-kpi">

                        <div className="kpi-icon">

                            <CheckCircle
                                size={22}
                            />

                        </div>


                        <div>

                            <span>
                                Completion Rate
                            </span>

                            <strong>
                                92%
                            </strong>

                            <small>
                                +4.2% from last month
                            </small>

                        </div>

                    </div>


                    {/* UPTIME */}

                    <div className="manager-kpi">

                        <div className="kpi-icon">

                            <Activity
                                size={22}
                            />

                        </div>


                        <div>

                            <span>
                                Equipment Uptime
                            </span>

                            <strong>
                                94.5%
                            </strong>

                            <small>
                                +2.4% from last month
                            </small>

                        </div>

                    </div>


                    {/* ON TIME */}

                    <div className="manager-kpi">

                        <div className="kpi-icon">

                            <TrendingUp
                                size={22}
                            />

                        </div>


                        <div>

                            <span>
                                On-Time Maintenance
                            </span>

                            <strong>
                                88%
                            </strong>

                            <small>
                                +3.1% from last month
                            </small>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                CHART SECTION
            ================================================== */}

            <div
                className="dashboard-two-column"
                style={{
                    marginTop: "20px"
                }}
            >


                {/* ==================================================
                    MAINTENANCE TREND
                ================================================== */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <h3>
                                Maintenance Trend
                            </h3>

                            <p>
                                Monthly maintenance activity
                            </p>

                        </div>


                        <BarChart3
                            size={20}
                        />

                    </div>


                    {/* CHART */}

                    <div
                        style={{
                            marginTop: "25px",
                            height: "270px",
                            display: "flex",
                            alignItems: "flex-end",
                            gap: "18px",
                            padding:
                                "20px 10px 0"
                        }}
                    >

                        {maintenanceTrend.map(
                            (item, index) => {

                                const height =
                                    (
                                        item.value /
                                        maxTrendValue
                                    ) * 100;


                                return (

                                    <div
                                        key={index}
                                        style={{
                                            flex: 1,
                                            height: "100%",
                                            display: "flex",
                                            flexDirection:
                                                "column",
                                            justifyContent:
                                                "flex-end",
                                            alignItems:
                                                "center",
                                            gap: "8px"
                                        }}
                                    >

                                        {/* VALUE */}

                                        <span
                                            style={{
                                                fontSize:
                                                    "12px",
                                                fontWeight:
                                                    "700",
                                                color:
                                                    "#475569"
                                            }}
                                        >
                                            {
                                                item.value
                                            }
                                        </span>


                                        {/* BAR */}

                                        <div
                                            style={{
                                                width:
                                                    "100%",
                                                maxWidth:
                                                    "45px",
                                                height:
                                                    `${height}%`,
                                                minHeight:
                                                    "15px",
                                                borderRadius:
                                                    "8px 8px 3px 3px",
                                                background:
                                                    "linear-gradient(180deg, #2563eb, #60a5fa)",
                                                transition:
                                                    "height .3s ease"
                                            }}
                                        />


                                        {/* MONTH */}

                                        <span
                                            style={{
                                                fontSize:
                                                    "12px",
                                                color:
                                                    "#64748b"
                                            }}
                                        >
                                            {
                                                item.month
                                            }
                                        </span>

                                    </div>

                                );

                            }
                        )}

                    </div>


                    {/* SUMMARY */}

                    <div
                        style={{
                            marginTop:
                                "20px",
                            padding:
                                "14px",
                            background:
                                "#f8fafc",
                            borderRadius:
                                "10px",
                            display:
                                "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center"
                        }}
                    >

                        <span
                            style={{
                                color:
                                    "#64748b",
                                fontSize:
                                    "13px"
                            }}
                        >
                            Average monthly activity
                        </span>


                        <strong
                            style={{
                                color:
                                    "#0f172a"
                            }}
                        >
                            72.5 requests
                        </strong>

                    </div>

                </div>


                {/* ==================================================
                    EQUIPMENT HEALTH
                ================================================== */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <h3>
                                Equipment Health
                            </h3>

                            <p>
                                Overall equipment condition
                            </p>

                        </div>


                        <Package
                            size={20}
                        />

                    </div>


                    {/* HEALTH CIRCLE */}

                    <div
                        style={{
                            display:
                                "flex",
                            justifyContent:
                                "center",
                            marginTop:
                                "20px"
                        }}
                    >

                        <div
                            style={{
                                width:
                                    "175px",
                                height:
                                    "175px",
                                borderRadius:
                                    "50%",
                                background:
                                    "conic-gradient(#22c55e 0deg 284deg, #f59e0b 284deg 331deg, #ef4444 331deg 360deg)",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center"
                            }}
                        >

                            <div
                                style={{
                                    width:
                                        "125px",
                                    height:
                                        "125px",
                                    borderRadius:
                                        "50%",
                                    background:
                                        "#ffffff",
                                    display:
                                        "flex",
                                    flexDirection:
                                        "column",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center"
                                }}
                            >

                                <strong
                                    style={{
                                        fontSize:
                                            "28px",
                                        color:
                                            "#0f172a"
                                    }}
                                >
                                    79%
                                </strong>


                                <span
                                    style={{
                                        fontSize:
                                            "13px",
                                        color:
                                            "#64748b"
                                    }}
                                >
                                    Good
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* HEALTH DETAILS */}

                    <div
                        style={{
                            marginTop:
                                "25px",
                            display:
                                "flex",
                            flexDirection:
                                "column",
                            gap:
                                "13px"
                        }}
                    >

                        {equipmentHealth.map(
                            (item, index) => (

                                <div
                                    key={index}
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "space-between"
                                    }}
                                >

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            gap:
                                                "9px"
                                        }}
                                    >

                                        <span
                                            style={{
                                                width:
                                                    "10px",
                                                height:
                                                    "10px",
                                                borderRadius:
                                                    "50%",
                                                background:
                                                    item.className ===
                                                    "good"
                                                        ? "#22c55e"
                                                        : item.className ===
                                                          "warning"
                                                        ? "#f59e0b"
                                                        : "#ef4444"
                                            }}
                                        />

                                        <span
                                            style={{
                                                color:
                                                    "#475569",
                                                fontSize:
                                                    "14px"
                                            }}
                                        >
                                            {
                                                item.label
                                            }
                                        </span>

                                    </div>


                                    <strong>
                                        {
                                            item.count
                                        }
                                    </strong>

                                </div>

                            )
                        )}

                    </div>

                </div>

            </div>


            {/* ==================================================
                SECOND CHART ROW
            ================================================== */}

            <div
                className="dashboard-two-column"
                style={{
                    marginTop:
                        "20px"
                }}
            >


                {/* ==================================================
                    MAINTENANCE STATUS
                ================================================== */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <h3>
                                Maintenance Status
                            </h3>

                            <p>
                                Current maintenance distribution
                            </p>

                        </div>


                        <Wrench
                            size={20}
                        />

                    </div>


                    <div
                        style={{
                            marginTop:
                                "25px",
                            display:
                                "flex",
                            flexDirection:
                                "column",
                            gap:
                                "20px"
                        }}
                    >

                        {maintenanceStatus.map(
                            (item, index) => (

                                <div
                                    key={index}
                                >

                                    {/* LABEL */}

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            marginBottom:
                                                "8px"
                                        }}
                                    >

                                        <span
                                            style={{
                                                fontSize:
                                                    "14px",
                                                color:
                                                    "#475569",
                                                fontWeight:
                                                    "500"
                                            }}
                                        >
                                            {
                                                item.label
                                            }
                                        </span>


                                        <strong
                                            style={{
                                                fontSize:
                                                    "14px"
                                            }}
                                        >
                                            {
                                                item.count
                                            }
                                        </strong>

                                    </div>


                                    {/* PROGRESS */}

                                    <div
                                        style={{
                                            width:
                                                "100%",
                                            height:
                                                "10px",
                                            background:
                                                "#e2e8f0",
                                            borderRadius:
                                                "20px",
                                            overflow:
                                                "hidden"
                                        }}
                                    >

                                        <div
                                            style={{
                                                width:
                                                    `${item.value}%`,
                                                height:
                                                    "100%",
                                                borderRadius:
                                                    "20px",
                                                background:
                                                    item.className ===
                                                    "completed"
                                                        ? "#22c55e"
                                                        : item.className ===
                                                          "progress"
                                                        ? "#3b82f6"
                                                        : item.className ===
                                                          "pending"
                                                        ? "#f59e0b"
                                                        : "#ef4444"
                                            }}
                                        />

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>


                {/* ==================================================
                    KPI PERFORMANCE CHART
                ================================================== */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <h3>
                                KPI Performance
                            </h3>

                            <p>
                                Performance against target
                            </p>

                        </div>


                        <TrendingUp
                            size={20}
                        />

                    </div>


                    <div
                        style={{
                            marginTop:
                                "25px",
                            display:
                                "flex",
                            flexDirection:
                                "column",
                            gap:
                                "22px"
                        }}
                    >

                        {kpiPerformance.map(
                            (item, index) => (

                                <div
                                    key={index}
                                >

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "center",
                                            marginBottom:
                                                "9px"
                                        }}
                                    >

                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                gap:
                                                    "9px"
                                            }}
                                        >

                                            <span
                                                style={{
                                                    color:
                                                        "#2563eb"
                                                }}
                                            >
                                                {
                                                    item.icon
                                                }
                                            </span>


                                            <span
                                                style={{
                                                    fontSize:
                                                        "14px",
                                                    color:
                                                        "#475569"
                                                }}
                                            >
                                                {
                                                    item.label
                                                }
                                            </span>

                                        </div>


                                        <strong>
                                            {
                                                item.value
                                            }%
                                        </strong>

                                    </div>


                                    {/* BAR */}

                                    <div
                                        style={{
                                            position:
                                                "relative",
                                            width:
                                                "100%",
                                            height:
                                                "12px",
                                            background:
                                                "#e2e8f0",
                                            borderRadius:
                                                "20px"
                                        }}
                                    >

                                        {/* TARGET */}

                                        <div
                                            style={{
                                                position:
                                                    "absolute",
                                                left:
                                                    `${item.target}%`,
                                                top:
                                                    "-4px",
                                                height:
                                                    "20px",
                                                width:
                                                    "2px",
                                                background:
                                                    "#64748b",
                                                zIndex:
                                                    2
                                            }}
                                        />


                                        {/* VALUE */}

                                        <div
                                            style={{
                                                width:
                                                    `${item.value}%`,
                                                height:
                                                    "100%",
                                                borderRadius:
                                                    "20px",
                                                background:
                                                    item.value >=
                                                    item.target
                                                        ? "#22c55e"
                                                        : "#f59e0b"
                                            }}
                                        />

                                    </div>


                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            marginTop:
                                                "6px",
                                            fontSize:
                                                "11px",
                                            color:
                                                "#94a3b8"
                                        }}
                                    >

                                        <span>
                                            0%
                                        </span>

                                        <span>
                                            Target{" "}
                                            {
                                                item.target
                                            }%
                                        </span>

                                        <span>
                                            100%
                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>

            </div>


            {/* ==================================================
                MANAGEMENT SUMMARY
            ================================================== */}

            <div
                className="dashboard-card"
                style={{
                    marginTop:
                        "20px"
                }}
            >

                <div className="card-header">

                    <div>

                        <h3>
                            Management Summary
                        </h3>

                        <p>
                            Current operational overview
                        </p>

                    </div>


                    <Activity
                        size={20}
                    />

                </div>


                <div
                    style={{
                        display:
                            "grid",
                        gridTemplateColumns:
                            "repeat(3, 1fr)",
                        gap:
                            "15px",
                        marginTop:
                            "20px"
                    }}
                >


                    {/* ACTIVE */}

                    <div
                        style={{
                            padding:
                                "18px",
                            borderRadius:
                                "13px",
                            background:
                                "#f0fdf4",
                            border:
                                "1px solid #bbf7d0"
                        }}
                    >

                        <CheckCircle
                            size={22}
                            color="#16a34a"
                        />


                        <strong
                            style={{
                                display:
                                    "block",
                                marginTop:
                                    "10px",
                                color:
                                    "#166534"
                            }}
                        >
                            System Operational
                        </strong>


                        <span
                            style={{
                                fontSize:
                                    "13px",
                                color:
                                    "#15803d"
                            }}
                        >
                            All major systems are running
                        </span>

                    </div>


                    {/* UPTIME */}

                    <div
                        style={{
                            padding:
                                "18px",
                            borderRadius:
                                "13px",
                            background:
                                "#eff6ff",
                            border:
                                "1px solid #bfdbfe"
                        }}
                    >

                        <Activity
                            size={22}
                            color="#2563eb"
                        />


                        <strong
                            style={{
                                display:
                                    "block",
                                marginTop:
                                    "10px",
                                color:
                                    "#1e40af"
                            }}
                        >
                            94.5% Uptime
                        </strong>


                        <span
                            style={{
                                fontSize:
                                    "13px",
                                color:
                                    "#1d4ed8"
                            }}
                        >
                            Equipment availability
                        </span>

                    </div>


                    {/* ATTENTION */}

                    <div
                        style={{
                            padding:
                                "18px",
                            borderRadius:
                                "13px",
                            background:
                                "#fff7ed",
                            border:
                                "1px solid #fed7aa"
                        }}
                    >

                        <AlertTriangle
                            size={22}
                            color="#ea580c"
                        />


                        <strong
                            style={{
                                display:
                                    "block",
                                marginTop:
                                    "10px",
                                color:
                                    "#9a3412"
                            }}
                        >
                            10 Critical
                        </strong>


                        <span
                            style={{
                                fontSize:
                                    "13px",
                                color:
                                    "#c2410c"
                            }}
                        >
                            Equipment needs attention
                        </span>

                    </div>

                </div>

            </div>


            {/* ==================================================
                MANAGEMENT ALERT
            ================================================== */}

            <div
                className="dashboard-alert manager-alert"
                style={{
                    marginTop:
                        "20px"
                }}
            >

                <AlertTriangle
                    size={20}
                />


                <div>

                    <strong>
                        Management Attention
                    </strong>


                    <p>
                        10 equipment units are currently
                        classified as critical and require
                        maintenance attention.
                    </p>

                </div>

            </div>


        </div>
    );
};


export default ManagerDashboard;
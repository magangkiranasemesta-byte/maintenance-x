import React, {
    useEffect,
    useState
} from "react";

import {
    Package,
    Wrench,
    CheckCircle,
    Clock,
    AlertTriangle,
    Activity,
    Users,
    Settings,
    X,
    Bell
} from "lucide-react";

import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";


const API = "http://localhost:3000";


const AdminDashboard = () => {

    // ======================================================
    // STATE - DASHBOARD STATISTICS
    // ======================================================

    const [
        dashboardStats,
        setDashboardStats
    ] = useState({

        totalEquipment: 0,

        activeMaintenance: 0,

        pendingApproval: 0,

        completed: 0

    });


    const [
        statsLoading,
        setStatsLoading
    ] = useState(true);


    const [
        statsError,
        setStatsError
    ] = useState("");


    // ======================================================
    // STATE - MAINTENANCE CHART
    // ======================================================

    const [
        maintenanceData,
        setMaintenanceData
    ] = useState([]);


    const [
        chartLoading,
        setChartLoading
    ] = useState(true);


    const [
        chartError,
        setChartError
    ] = useState("");


    // ======================================================
    // STATE - NOTIFICATION
    // ======================================================

    const [
        showNotifications,
        setShowNotifications
    ] = useState(false);


    const [
        selectedNotification,
        setSelectedNotification
    ] = useState(null);


    // ======================================================
    // STATE - SYSTEM OVERVIEW
    // ======================================================

    const [
        showSystemOverview,
        setShowSystemOverview
    ] = useState(false);


    // ======================================================
    // NOTIFICATIONS
    // ======================================================

    const notifications = [

        {
            id: 1,

            title:
                "New maintenance request",

            description:
                "Ada maintenance request baru.",

            time:
                "10 minutes ago",

            type:
                "maintenance"

        },

        {
            id: 2,

            title:
                "Maintenance approved",

            description:
                "Maintenance request telah disetujui.",

            time:
                "1 hour ago",

            type:
                "approval"

        },

        {
            id: 3,

            title:
                "Equipment requires attention",

            description:
                "Ada equipment yang membutuhkan perhatian.",

            time:
                "2 hours ago",

            type:
                "warning"

        }

    ];


    // ======================================================
    // LOAD DASHBOARD STATISTICS
    // ======================================================

    const loadDashboardStats =
        async () => {

            try {

                setStatsLoading(true);

                setStatsError("");


                const response =
                    await fetch(
                        `${API}/api/dashboard/stats`
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Gagal mengambil statistik dashboard"
                    );

                }


                setDashboardStats({

                    totalEquipment:
                        Number(
                            result.totalEquipment ||
                            0
                        ),

                    activeMaintenance:
                        Number(
                            result.activeMaintenance ||
                            0
                        ),

                    pendingApproval:
                        Number(
                            result.pendingApproval ||
                            0
                        ),

                    completed:
                        Number(
                            result.completed ||
                            0
                        )

                });


            } catch (error) {

                console.error(
                    "Dashboard error:",
                    error
                );


                setStatsError(
                    error.message
                );


            } finally {

                setStatsLoading(false);

            }

        };


    // ======================================================
    // LOAD MAINTENANCE DATA
    // ======================================================

    const loadMaintenanceChart =
        async () => {

            try {

                setChartLoading(true);

                setChartError("");


                const response =
                    await fetch(
                        `${API}/api/maintenance`
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Gagal mengambil data maintenance"
                    );

                }


                /*
                 * Backend kemungkinan mengembalikan:
                 *
                 * [
                 *   {...},
                 *   {...}
                 * ]
                 *
                 * atau:
                 *
                 * {
                 *   data: [...]
                 * }
                 */


                const data =
                    Array.isArray(result)
                        ? result
                        : result.data || [];


                setMaintenanceData(data);


            } catch (error) {

                console.error(
                    "Maintenance chart error:",
                    error
                );


                setChartError(
                    error.message
                );


                setMaintenanceData([]);


            } finally {

                setChartLoading(false);

            }

        };


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {

        loadDashboardStats();

        loadMaintenanceChart();

    }, []);


    // ======================================================
    // NOTIFICATION CLICK
    // ======================================================

    const handleNotificationClick =
        (notification) => {

            setSelectedNotification(
                notification
            );

            setShowNotifications(
                false
            );

        };


    // ======================================================
    // CLOSE NOTIFICATION
    // ======================================================

    const closeNotification =
        () => {

            setSelectedNotification(
                null
            );

        };


    // ======================================================
    // REFRESH DASHBOARD
    // ======================================================

    const refreshDashboard =
        () => {

            loadDashboardStats();

            loadMaintenanceChart();

        };


    // ======================================================
    // CHART - STATUS DATA
    // ======================================================

    const statusList = [

        {
            key:
                "PENDING_SUPERVISOR",

            label:
                "Pending Supervisor"
        },

        {
            key:
                "PENDING_MANAGER",

            label:
                "Pending Manager"
        },

        {
            key:
                "APPROVED",

            label:
                "Approved"
        },

        {
            key:
                "IN_PROGRESS",

            label:
                "In Progress"
        },

        {
            key:
                "COMPLETED",

            label:
                "Completed"
        },

        {
            key:
                "REJECTED",

            label:
                "Rejected"
        }

    ];


    const statusChartData =
        statusList.map(
            (item) => {

                const total =
                    maintenanceData.filter(
                        (maintenance) => {

                            return (
                                String(
                                    maintenance.status ||
                                    ""
                                ).toUpperCase() ===
                                item.key
                            );

                        }
                    ).length;


                return {

                    ...item,

                    total

                };

            }
        );


    const maxStatus =
        Math.max(
            ...statusChartData.map(
                (item) =>
                    item.total
            ),
            1
        );


    // ======================================================
    // CHART - MONTHLY DATA
    // ======================================================

    const currentYear =
        new Date().getFullYear();


    const monthNames = [

        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"

    ];


    const monthlyChartData =
        monthNames.map(
            (
                month,
                index
            ) => {

                const total =
                    maintenanceData.filter(
                        (maintenance) => {

                            if (
                                !maintenance.created_at
                            ) {

                                return false;

                            }


                            const date =
                                new Date(
                                    maintenance.created_at
                                );


                            return (

                                date.getFullYear() ===
                                    currentYear &&

                                date.getMonth() ===
                                    index

                            );

                        }
                    ).length;


                return {

                    month,

                    total

                };

            }
        );


    const maxMonthly =
        Math.max(
            ...monthlyChartData.map(
                (item) =>
                    item.total
            ),
            1
        );


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <div className="role-dashboard">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div
                className="dashboard-header"
                style={{
                    position:
                        "relative"
                }}
            >

                {/* LEFT */}

                <div>

                    <p
                        className="dashboard-label"
                    >
                        ADMIN PANEL
                    </p>


                    <h1>
                        Admin Dashboard
                    </h1>


                    <p
                        className="dashboard-description"
                    >
                        Monitor seluruh aktivitas
                        equipment dan maintenance
                        system.
                    </p>

                </div>


                {/* RIGHT */}

                <div
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap:
                            "12px",

                        position:
                            "relative"
                    }}
                >


                    {/* ==================================================
                        NOTIFICATION BUTTON
                    ================================================== */}

                    <button

                        type="button"

                        onClick={() => {

                            setShowNotifications(
                                !showNotifications
                            );

                            setSelectedNotification(
                                null
                            );

                        }}

                        style={{
                            position:
                                "relative",

                            width:
                                "58px",

                            height:
                                "58px",

                            border:
                                "1px solid #dbe3ef",

                            borderRadius:
                                "14px",

                            background:
                                "#ffffff",

                            display:
                                "flex",

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            cursor:
                                "pointer",

                            color:
                                "#475569"
                        }}
                    >

                        <Bell
                            size={23}
                        />


                        {/* BADGE */}

                        {notifications.length >
                            0 && (

                            <span
                                style={{
                                    position:
                                        "absolute",

                                    top:
                                        "5px",

                                    right:
                                        "5px",

                                    minWidth:
                                        "21px",

                                    height:
                                        "21px",

                                    padding:
                                        "0 5px",

                                    borderRadius:
                                        "50%",

                                    background:
                                        "#ef4444",

                                    color:
                                        "#ffffff",

                                    fontSize:
                                        "11px",

                                    fontWeight:
                                        "700",

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    border:
                                        "2px solid #ffffff"
                                }}
                            >
                                {
                                    notifications.length
                                }
                            </span>

                        )}

                    </button>


                    {/* ==================================================
                        NOTIFICATION POPUP
                    ================================================== */}

                    {showNotifications && (

                        <div
                            style={{
                                position:
                                    "absolute",

                                top:
                                    "68px",

                                right:
                                    "150px",

                                width:
                                    "390px",

                                background:
                                    "#ffffff",

                                border:
                                    "1px solid #e2e8f0",

                                borderRadius:
                                    "16px",

                                boxShadow:
                                    "0 20px 50px rgba(15,23,42,.18)",

                                overflow:
                                    "hidden",

                                zIndex:
                                    5000
                            }}
                        >

                            {/* HEADER */}

                            <div
                                style={{
                                    padding:
                                        "18px 20px",

                                    borderBottom:
                                        "1px solid #e2e8f0",

                                    display:
                                        "flex",

                                    justifyContent:
                                        "space-between",

                                    alignItems:
                                        "center"
                                }}
                            >

                                <div>

                                    <h3
                                        style={{
                                            margin:
                                                "0",

                                            color:
                                                "#0f172a",

                                            fontSize:
                                                "19px"
                                        }}
                                    >
                                        Notifications
                                    </h3>


                                    <p
                                        style={{
                                            margin:
                                                "4px 0 0",

                                            color:
                                                "#64748b",

                                            fontSize:
                                                "13px"
                                        }}
                                    >
                                        You have{" "}
                                        {
                                            notifications.length
                                        }{" "}
                                        new notifications
                                    </p>

                                </div>


                                <Bell
                                    size={23}
                                    color="#2563eb"
                                />

                            </div>


                            {/* LIST */}

                            {notifications.map(
                                (
                                    notification
                                ) => (

                                    <button

                                        key={
                                            notification.id
                                        }

                                        type="button"

                                        onClick={() =>
                                            handleNotificationClick(
                                                notification
                                            )
                                        }

                                        style={{
                                            width:
                                                "100%",

                                            border:
                                                "none",

                                            borderBottom:
                                                "1px solid #f1f5f9",

                                            background:
                                                "#ffffff",

                                            padding:
                                                "17px 20px",

                                            display:
                                                "flex",

                                            gap:
                                                "14px",

                                            alignItems:
                                                "flex-start",

                                            textAlign:
                                                "left",

                                            cursor:
                                                "pointer"
                                        }}
                                    >

                                        {/* ICON */}

                                        <div
                                            style={{
                                                width:
                                                    "44px",

                                                height:
                                                    "44px",

                                                flexShrink:
                                                    0,

                                                borderRadius:
                                                    "12px",

                                                display:
                                                    "flex",

                                                alignItems:
                                                    "center",

                                                justifyContent:
                                                    "center",

                                                background:
                                                    notification.type ===
                                                    "maintenance"

                                                        ? "#eff6ff"

                                                        : notification.type ===
                                                          "approval"

                                                        ? "#f0fdf4"

                                                        : "#fff7ed",

                                                color:
                                                    notification.type ===
                                                    "maintenance"

                                                        ? "#2563eb"

                                                        : notification.type ===
                                                          "approval"

                                                        ? "#16a34a"

                                                        : "#ea580c"
                                            }}
                                        >

                                            {notification.type ===
                                                "maintenance" && (

                                                <Wrench
                                                    size={
                                                        21
                                                    }
                                                />

                                            )}


                                            {notification.type ===
                                                "approval" && (

                                                <CheckCircle
                                                    size={
                                                        21
                                                    }
                                                />

                                            )}


                                            {notification.type ===
                                                "warning" && (

                                                <AlertTriangle
                                                    size={
                                                        21
                                                    }
                                                />

                                            )}

                                        </div>


                                        {/* CONTENT */}

                                        <div>

                                            <strong
                                                style={{
                                                    display:
                                                        "block",

                                                    color:
                                                        "#0f172a",

                                                    fontSize:
                                                        "15px",

                                                    marginBottom:
                                                        "5px"
                                                }}
                                            >
                                                {
                                                    notification.title
                                                }
                                            </strong>


                                            <span
                                                style={{
                                                    display:
                                                        "block",

                                                    color:
                                                        "#475569",

                                                    fontSize:
                                                        "14px"
                                                }}
                                            >
                                                {
                                                    notification.description
                                                }
                                            </span>


                                            <small
                                                style={{
                                                    display:
                                                        "block",

                                                    marginTop:
                                                        "5px",

                                                    color:
                                                        "#94a3b8"
                                                }}
                                            >
                                                {
                                                    notification.time
                                                }
                                            </small>

                                        </div>

                                    </button>

                                )
                            )}


                            {/* FOOTER */}

                            <div
                                style={{
                                    padding:
                                        "13px",

                                    textAlign:
                                        "center"
                                }}
                            >

                                <button

                                    type="button"

                                    onClick={() =>
                                        setShowNotifications(
                                            false
                                        )
                                    }

                                    style={{
                                        border:
                                            "none",

                                        background:
                                            "transparent",

                                        color:
                                            "#2563eb",

                                        fontWeight:
                                            "600",

                                        cursor:
                                            "pointer"
                                    }}
                                >
                                    Close Notifications
                                </button>

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        SYSTEM OVERVIEW
                    ================================================== */}

                    <button

                        type="button"

                        className="dashboard-date"

                        onClick={() =>
                            setShowSystemOverview(
                                true
                            )
                        }
                    >

                        <Activity
                            size={18}
                        />

                        <span>
                            System Overview
                        </span>

                    </button>

                </div>

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {statsError && (

                <div
                    style={{
                        marginBottom:
                            "16px",

                        padding:
                            "13px 16px",

                        borderRadius:
                            "10px",

                        background:
                            "#fef2f2",

                        border:
                            "1px solid #fecaca",

                        color:
                            "#b91c1c",

                        display:
                            "flex",

                        justifyContent:
                            "space-between",

                        alignItems:
                            "center"
                    }}
                >

                    <span>
                        Gagal memuat data:
                        {" "}
                        {statsError}
                    </span>


                    <button
                        type="button"
                        onClick={
                            refreshDashboard
                        }
                        style={{
                            border:
                                "none",

                            background:
                                "#b91c1c",

                            color:
                                "#ffffff",

                            padding:
                                "7px 12px",

                            borderRadius:
                                "7px",

                            cursor:
                                "pointer"
                        }}
                    >
                        Coba Lagi
                    </button>

                </div>

            )}


            {/* ==================================================
                STATISTICS
            ================================================== */}

            <div
                className="dashboard-stat-grid"
            >

                {/* TOTAL EQUIPMENT */}

                <StatCard

                    title="Total Equipment"

                    value={
                        statsLoading
                            ? "..."
                            : dashboardStats.totalEquipment
                    }

                    subtitle="Registered equipment"

                    icon={
                        <Package
                            size={24}
                        />
                    }

                    variant="blue"

                />


                {/* ACTIVE MAINTENANCE */}

                <StatCard

                    title="Active Maintenance"

                    value={
                        statsLoading
                            ? "..."
                            : dashboardStats.activeMaintenance
                    }

                    subtitle="Currently in progress"

                    icon={
                        <Wrench
                            size={24}
                        />
                    }

                    variant="orange"

                />


                {/* PENDING APPROVAL */}

                <StatCard

                    title="Pending Approval"

                    value={
                        statsLoading
                            ? "..."
                            : dashboardStats.pendingApproval
                    }

                    subtitle="Need supervisor review"

                    icon={
                        <Clock
                            size={24}
                        />
                    }

                    variant="purple"

                />


                {/* COMPLETED */}

                <StatCard

                    title="Completed"

                    value={
                        statsLoading
                            ? "..."
                            : dashboardStats.completed
                    }

                    subtitle="Maintenance completed"

                    icon={
                        <CheckCircle
                            size={24}
                        />
                    }

                    variant="green"

                />

            </div>


            {/* ==================================================
                MAINTENANCE ANALYTICS
            ================================================== */}

            <div
                style={{
                    display:
                        "grid",

                    gridTemplateColumns:
                        "minmax(0, 1.5fr) minmax(0, 1fr)",

                    gap:
                        "20px",

                    marginTop:
                        "20px"
                }}
            >


                {/* ==================================================
                    MAINTENANCE TREND
                ================================================== */}

                <div
                    className="dashboard-card"
                >

                    <div
                        className="card-header"
                    >

                        <div>

                            <h3>
                                Maintenance Trend
                            </h3>

                            <p>
                                Maintenance request per bulan (
                                {currentYear}
                                )
                            </p>

                        </div>


                        <Activity
                            size={20}
                        />

                    </div>


                    {chartError ? (

                        <div
                            style={{
                                minHeight:
                                    "260px",

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                color:
                                    "#dc2626",

                                textAlign:
                                    "center",

                                padding:
                                    "20px"
                            }}
                        >

                            <div>

                                <AlertTriangle
                                    size={30}
                                    style={{
                                        marginBottom:
                                            "10px"
                                    }}
                                />

                                <p>
                                    Gagal memuat
                                    grafik maintenance.
                                </p>

                                <small>
                                    {chartError}
                                </small>

                            </div>

                        </div>

                    ) : chartLoading ? (

                        <div
                            style={{
                                minHeight:
                                    "260px",

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                color:
                                    "#64748b"
                            }}
                        >
                            Memuat grafik...
                        </div>

                    ) : (

                        <div
                            style={{
                                height:
                                    "280px",

                                display:
                                    "flex",

                                alignItems:
                                    "flex-end",

                                gap:
                                    "12px",

                                padding:
                                    "30px 10px 10px",

                                borderBottom:
                                    "1px solid #e2e8f0"
                            }}
                        >

                            {monthlyChartData.map(
                                (item) => {

                                    const height =
                                        item.total === 0

                                            ? 4

                                            : Math.max(
                                                (
                                                    item.total /
                                                    maxMonthly
                                                ) * 190,
                                                12
                                            );


                                    return (

                                        <div
                                            key={
                                                item.month
                                            }

                                            style={{
                                                flex:
                                                    1,

                                                height:
                                                    "100%",

                                                display:
                                                    "flex",

                                                flexDirection:
                                                    "column",

                                                justifyContent:
                                                    "flex-end",

                                                alignItems:
                                                    "center",

                                                gap:
                                                    "8px"
                                            }}
                                        >

                                            {/* VALUE */}

                                            <span
                                                style={{
                                                    fontSize:
                                                        "12px",

                                                    fontWeight:
                                                        "600",

                                                    color:
                                                        "#475569"
                                                }}
                                            >
                                                {
                                                    item.total
                                                }
                                            </span>


                                            {/* BAR */}

                                            <div
                                                title={`${item.total} maintenance`}
                                                style={{
                                                    width:
                                                        "100%",

                                                    maxWidth:
                                                        "42px",

                                                    height:
                                                        `${height}px`,

                                                    minHeight:
                                                        "4px",

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
                                                        "11px",

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

                    )}

                </div>


                {/* ==================================================
                    MAINTENANCE STATUS
                ================================================== */}

                <div
                    className="dashboard-card"
                >

                    <div
                        className="card-header"
                    >

                        <div>

                            <h3>
                                Maintenance Status
                            </h3>

                            <p>
                                Distribusi status maintenance
                            </p>

                        </div>


                        <Wrench
                            size={20}
                        />

                    </div>


                    {chartError ? (

                        <div
                            style={{
                                minHeight:
                                    "260px",

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                color:
                                    "#dc2626",

                                textAlign:
                                    "center"
                            }}
                        >

                            <AlertTriangle
                                size={28}
                            />

                        </div>

                    ) : chartLoading ? (

                        <div
                            style={{
                                minHeight:
                                    "260px",

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                color:
                                    "#64748b"
                            }}
                        >
                            Memuat grafik...
                        </div>

                    ) : (

                        <div
                            style={{
                                marginTop:
                                    "20px"
                            }}
                        >

                            {statusChartData.map(
                                (item) => {

                                    const percentage =
                                        item.total ===
                                        0

                                            ? 0

                                            : (
                                                item.total /
                                                maxStatus
                                            ) * 100;


                                    return (

                                        <div
                                            key={
                                                item.key
                                            }

                                            style={{
                                                marginBottom:
                                                    "17px"
                                            }}
                                        >

                                            {/* LABEL */}

                                            <div
                                                style={{
                                                    display:
                                                        "flex",

                                                    justifyContent:
                                                        "space-between",

                                                    marginBottom:
                                                        "7px"
                                                }}
                                            >

                                                <span
                                                    style={{
                                                        fontSize:
                                                            "13px",

                                                        fontWeight:
                                                            "600",

                                                        color:
                                                            "#334155"
                                                    }}
                                                >
                                                    {
                                                        item.label
                                                    }
                                                </span>


                                                <span
                                                    style={{
                                                        fontSize:
                                                            "13px",

                                                        fontWeight:
                                                            "700",

                                                        color:
                                                            "#0f172a"
                                                    }}
                                                >
                                                    {
                                                        item.total
                                                    }
                                                </span>

                                            </div>


                                            {/* PROGRESS */}

                                            <div
                                                style={{
                                                    width:
                                                        "100%",

                                                    height:
                                                        "8px",

                                                    borderRadius:
                                                        "999px",

                                                    background:
                                                        "#e2e8f0",

                                                    overflow:
                                                        "hidden"
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        width:
                                                            `${percentage}%`,

                                                        height:
                                                            "100%",

                                                        borderRadius:
                                                            "999px",

                                                        background:
                                                            item.key ===
                                                            "COMPLETED"

                                                                ? "#16a34a"

                                                                : item.key ===
                                                                  "REJECTED"

                                                                ? "#dc2626"

                                                                : item.key ===
                                                                  "IN_PROGRESS"

                                                                ? "#ea580c"

                                                                : item.key ===
                                                                  "APPROVED"

                                                                ? "#2563eb"

                                                                : item.key ===
                                                                  "PENDING_MANAGER"

                                                                ? "#9333ea"

                                                                : "#7c3aed",

                                                        transition:
                                                            "width .3s ease"
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )}

                </div>

            </div>


            {/* ==================================================
                SYSTEM INFORMATION
            ================================================== */}

            <div
                className="dashboard-card"
                style={{
                    marginTop:
                        "20px"
                }}
            >

                <div
                    className="card-header"
                >

                    <div>

                        <h3>
                            System Information
                        </h3>

                        <p>
                            Current system statistics
                        </p>

                    </div>

                    <Settings
                        size={20}
                    />

                </div>


                <div
                    style={{
                        display:
                            "grid",

                        gridTemplateColumns:
                            "repeat(2, 1fr)",

                        gap:
                            "15px",

                        marginTop:
                            "15px"
                    }}
                >

                    {/* ACTIVE SYSTEM */}

                    <div
                        style={{
                            padding:
                                "15px",

                            borderRadius:
                                "12px",

                            background:
                                "#f8fafc"
                        }}
                    >

                        <Users
                            size={21}
                        />

                        <strong
                            style={{
                                display:
                                    "block",

                                marginTop:
                                    "8px"
                            }}
                        >
                            Active System
                        </strong>

                        <span
                            style={{
                                color:
                                    "#16a34a",

                                fontSize:
                                    "13px"
                            }}
                        >
                            ● Operational
                        </span>

                    </div>


                    {/* DATABASE */}

                    <div
                        style={{
                            padding:
                                "15px",

                            borderRadius:
                                "12px",

                            background:
                                "#f8fafc"
                        }}
                    >

                        <Activity
                            size={21}
                        />

                        <strong
                            style={{
                                display:
                                    "block",

                                marginTop:
                                    "8px"
                            }}
                        >
                            Database
                        </strong>

                        <span
                            style={{
                                color:
                                    statsError
                                        ? "#dc2626"
                                        : "#16a34a",

                                fontSize:
                                    "13px"
                            }}
                        >
                            ●{" "}
                            {
                                statsError
                                    ? "Connection Error"
                                    : "Connected"
                            }
                        </span>

                    </div>

                </div>

            </div>


            {/* ==================================================
                NOTIFICATION DETAIL MODAL
            ================================================== */}

            {selectedNotification && (

                <div
                    style={{
                        position:
                            "fixed",

                        inset:
                            0,

                        background:
                            "rgba(15,23,42,.45)",

                        display:
                            "flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        padding:
                            "20px",

                        zIndex:
                            10000
                    }}

                    onClick={
                        closeNotification
                    }
                >

                    <div
                        style={{
                            width:
                                "100%",

                            maxWidth:
                                "500px",

                            background:
                                "#ffffff",

                            borderRadius:
                                "18px",

                            padding:
                                "28px",

                            boxShadow:
                                "0 25px 70px rgba(0,0,0,.2)"
                        }}

                        onClick={(
                            event
                        ) =>
                            event.stopPropagation()
                        }
                    >

                        {/* HEADER */}

                        <div
                            style={{
                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "space-between",

                                marginBottom:
                                    "20px"
                            }}
                        >

                            <h2
                                style={{
                                    margin:
                                        0,

                                    color:
                                        "#0f172a"
                                }}
                            >
                                Notification Detail
                            </h2>


                            <button

                                type="button"

                                onClick={
                                    closeNotification
                                }

                                style={{
                                    width:
                                        "38px",

                                    height:
                                        "38px",

                                    border:
                                        "none",

                                    borderRadius:
                                        "10px",

                                    background:
                                        "#f1f5f9",

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    cursor:
                                        "pointer"
                                }}
                            >

                                <X
                                    size={20}
                                />

                            </button>

                        </div>


                        {/* ICON */}

                        <div
                            style={{
                                width:
                                    "64px",

                                height:
                                    "64px",

                                borderRadius:
                                    "16px",

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                marginBottom:
                                    "18px",

                                background:
                                    selectedNotification.type ===
                                    "maintenance"

                                        ? "#eff6ff"

                                        : selectedNotification.type ===
                                          "approval"

                                        ? "#f0fdf4"

                                        : "#fff7ed",

                                color:
                                    selectedNotification.type ===
                                    "maintenance"

                                        ? "#2563eb"

                                        : selectedNotification.type ===
                                          "approval"

                                        ? "#16a34a"

                                        : "#ea580c"
                            }}
                        >

                            {selectedNotification.type ===
                                "maintenance" && (

                                <Wrench
                                    size={30}
                                />

                            )}


                            {selectedNotification.type ===
                                "approval" && (

                                <CheckCircle
                                    size={30}
                                />

                            )}


                            {selectedNotification.type ===
                                "warning" && (

                                <AlertTriangle
                                    size={30}
                                />

                            )}

                        </div>


                        {/* TITLE */}

                        <h3
                            style={{
                                margin:
                                    "0 0 8px",

                                color:
                                    "#0f172a",

                                fontSize:
                                    "21px"
                            }}
                        >
                            {
                                selectedNotification.title
                            }
                        </h3>


                        {/* DESCRIPTION */}

                        <p
                            style={{
                                margin:
                                    "0 0 10px",

                                color:
                                    "#475569",

                                fontSize:
                                    "15px"
                            }}
                        >
                            {
                                selectedNotification.description
                            }
                        </p>


                        {/* TIME */}

                        <span
                            style={{
                                color:
                                    "#94a3b8",

                                fontSize:
                                    "13px"
                            }}
                        >
                            {
                                selectedNotification.time
                            }
                        </span>


                        {/* DETAIL */}

                        <div
                            style={{
                                marginTop:
                                    "22px",

                                padding:
                                    "17px",

                                borderRadius:
                                    "12px",

                                background:
                                    "#f8fafc",

                                border:
                                    "1px solid #e2e8f0"
                            }}
                        >

                            {selectedNotification.type ===
                                "maintenance" && (

                                <>

                                    <strong>
                                        Maintenance Request
                                    </strong>

                                    <p>
                                        Terdapat
                                        maintenance
                                        request baru
                                        yang perlu
                                        diperiksa.
                                    </p>

                                </>

                            )}


                            {selectedNotification.type ===
                                "approval" && (

                                <>

                                    <strong>
                                        Maintenance Approved
                                    </strong>

                                    <p>
                                        Maintenance
                                        request telah
                                        disetujui.
                                    </p>

                                </>

                            )}


                            {selectedNotification.type ===
                                "warning" && (

                                <>

                                    <strong>
                                        Equipment Warning
                                    </strong>

                                    <p>
                                        Equipment
                                        membutuhkan
                                        perhatian
                                        lebih lanjut.
                                    </p>

                                </>

                            )}

                        </div>


                        {/* CLOSE */}

                        <button

                            type="button"

                            onClick={
                                closeNotification
                            }

                            style={{
                                width:
                                    "100%",

                                marginTop:
                                    "20px",

                                padding:
                                    "13px",

                                border:
                                    "none",

                                borderRadius:
                                    "10px",

                                background:
                                    "#2563eb",

                                color:
                                    "#ffffff",

                                fontWeight:
                                    "600",

                                cursor:
                                    "pointer"
                            }}
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}


            {/* ==================================================
                SYSTEM OVERVIEW MODAL
            ================================================== */}

            {showSystemOverview && (

                <div
                    style={{
                        position:
                            "fixed",

                        inset:
                            0,

                        background:
                            "rgba(15,23,42,.45)",

                        display:
                            "flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        padding:
                            "20px",

                        zIndex:
                            9999
                    }}

                    onClick={() =>
                        setShowSystemOverview(
                            false
                        )
                    }
                >

                    <div
                        style={{
                            width:
                                "100%",

                            maxWidth:
                                "600px",

                            background:
                                "#ffffff",

                            borderRadius:
                                "18px",

                            padding:
                                "28px",

                            boxShadow:
                                "0 25px 70px rgba(0,0,0,.2)"
                        }}

                        onClick={(
                            event
                        ) =>
                            event.stopPropagation()
                        }
                    >

                        {/* HEADER */}

                        <div
                            style={{
                                display:
                                    "flex",

                                justifyContent:
                                    "space-between",

                                alignItems:
                                    "center",

                                marginBottom:
                                    "22px"
                            }}
                        >

                            <div>

                                <h2
                                    style={{
                                        margin:
                                            0,

                                        color:
                                            "#0f172a"
                                    }}
                                >
                                    System Overview
                                </h2>

                                <p
                                    style={{
                                        margin:
                                            "5px 0 0",

                                        color:
                                            "#64748b"
                                    }}
                                >
                                    Current system status
                                </p>

                            </div>


                            <button

                                type="button"

                                onClick={() =>
                                    setShowSystemOverview(
                                        false
                                    )
                                }

                                style={{
                                    width:
                                        "38px",

                                    height:
                                        "38px",

                                    border:
                                        "none",

                                    borderRadius:
                                        "10px",

                                    background:
                                        "#f1f5f9",

                                    cursor:
                                        "pointer",

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center"
                                }}
                            >

                                <X
                                    size={20}
                                />

                            </button>

                        </div>


                        {/* STATUS */}

                        <div
                            style={{
                                padding:
                                    "18px",

                                borderRadius:
                                    "14px",

                                background:
                                    "#f0fdf4",

                                border:
                                    "1px solid #bbf7d0",

                                marginBottom:
                                    "18px"
                            }}
                        >

                            <div
                                style={{
                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    gap:
                                        "12px"
                                }}
                            >

                                <CheckCircle
                                    size={28}
                                    color="#16a34a"
                                />

                                <div>

                                    <strong
                                        style={{
                                            display:
                                                "block",

                                            color:
                                                "#166534"
                                        }}
                                    >
                                        System Operational
                                    </strong>

                                    <span
                                        style={{
                                            color:
                                                "#15803d",

                                            fontSize:
                                                "13px"
                                        }}
                                    >
                                        Database connected
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* STAT GRID */}

                        <div
                            style={{
                                display:
                                    "grid",

                                gridTemplateColumns:
                                    "repeat(2, 1fr)",

                                gap:
                                    "14px"
                            }}
                        >

                            {/* EQUIPMENT */}

                            <div
                                style={{
                                    padding:
                                        "18px",

                                    border:
                                        "1px solid #e2e8f0",

                                    borderRadius:
                                        "13px"
                                }}
                            >

                                <Package
                                    size={23}
                                    color="#2563eb"
                                />

                                <h3
                                    style={{
                                        margin:
                                            "10px 0 3px"
                                    }}
                                >
                                    {
                                        dashboardStats.totalEquipment
                                    }
                                </h3>

                                <span>
                                    Total Equipment
                                </span>

                            </div>


                            {/* ACTIVE */}

                            <div
                                style={{
                                    padding:
                                        "18px",

                                    border:
                                        "1px solid #e2e8f0",

                                    borderRadius:
                                        "13px"
                                }}
                            >

                                <Wrench
                                    size={23}
                                    color="#ea580c"
                                />

                                <h3
                                    style={{
                                        margin:
                                            "10px 0 3px"
                                    }}
                                >
                                    {
                                        dashboardStats.activeMaintenance
                                    }
                                </h3>

                                <span>
                                    Active Maintenance
                                </span>

                            </div>


                            {/* PENDING */}

                            <div
                                style={{
                                    padding:
                                        "18px",

                                    border:
                                        "1px solid #e2e8f0",

                                    borderRadius:
                                        "13px"
                                }}
                            >

                                <Clock
                                    size={23}
                                    color="#7c3aed"
                                />

                                <h3
                                    style={{
                                        margin:
                                            "10px 0 3px"
                                    }}
                                >
                                    {
                                        dashboardStats.pendingApproval
                                    }
                                </h3>

                                <span>
                                    Pending Approval
                                </span>

                            </div>


                            {/* COMPLETED */}

                            <div
                                style={{
                                    padding:
                                        "18px",

                                    border:
                                        "1px solid #e2e8f0",

                                    borderRadius:
                                        "13px"
                                }}
                            >

                                <CheckCircle
                                    size={23}
                                    color="#16a34a"
                                />

                                <h3
                                    style={{
                                        margin:
                                            "10px 0 3px"
                                    }}
                                >
                                    {
                                        dashboardStats.completed
                                    }
                                </h3>

                                <span>
                                    Completed
                                </span>

                            </div>

                        </div>


                        {/* REFRESH */}

                        <button

                            type="button"

                            onClick={
                                refreshDashboard
                            }

                            style={{
                                width:
                                    "100%",

                                marginTop:
                                    "20px",

                                padding:
                                    "12px",

                                border:
                                    "1px solid #2563eb",

                                borderRadius:
                                    "10px",

                                background:
                                    "#ffffff",

                                color:
                                    "#2563eb",

                                fontWeight:
                                    "600",

                                cursor:
                                    "pointer"
                            }}
                        >
                            Refresh Data
                        </button>

                    </div>

                </div>

            )}

        </div>

    );

};


export default AdminDashboard;
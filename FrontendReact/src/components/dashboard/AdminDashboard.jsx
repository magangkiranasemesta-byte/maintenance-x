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


const API =
    "http://localhost:3000";


const AdminDashboard = () => {


    // ======================================================
    // STATE
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


    const [
        showNotifications,
        setShowNotifications
    ] = useState(false);


    const [
        selectedNotification,
        setSelectedNotification
    ] = useState(null);


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
    // LOAD DASHBOARD
    // ======================================================

    const loadDashboardStats =
        async () => {

            try {

                setStatsLoading(
                    true
                );

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

                setStatsLoading(
                    false
                );

            }

        };


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {

        loadDashboardStats();

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
    // CLOSE NOTIFICATION DETAIL
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

        };


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


                    {/* ==========================================
                        NOTIFICATION BUTTON
                    ========================================== */}

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


                    {/* ==========================================
                        NOTIFICATION POPUP
                    ========================================== */}

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


                    {/* ==========================================
                        SYSTEM OVERVIEW
                    ========================================== */}

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
                                        "pointer"
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
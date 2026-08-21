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
    Bell,
    RefreshCw,
    UserCheck
} from "lucide-react";

import StatCard from "./StatCard";

const API = "http://localhost:3000";

const AdminDashboard = () => {

    // ======================================================
    // DASHBOARD DATA
    // ======================================================

    const [dashboardData, setDashboardData] = useState({
        stats: {
            totalEquipment: 0,
            activeMaintenance: 0,
            pendingApproval: 0,
            completed: 0,
            rejected: 0,
            totalMaintenance: 0,
            completionRate: 0,
            equipmentUptime: null,
            onTimeMaintenance: null
        },

        maintenanceTrend: [],

        maintenanceStatus: [],

        equipmentHealth: {
            good: 0,
            warning: 0,
            critical: 0,
            goodPercentage: 0
        },

        approvalHistory: [],

        recentMaintenance: []
    });

    // ======================================================
    // LOADING / ERROR
    // ======================================================

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ======================================================
    // MODAL
    // ======================================================

    const [showNotifications, setShowNotifications] =
        useState(false);

    const [selectedNotification, setSelectedNotification] =
        useState(null);

    const [showSystemOverview, setShowSystemOverview] =
        useState(false);

    // ======================================================
    // LOAD DASHBOARD
    // ======================================================

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API}/api/dashboard/stats`
            );

            const result = await response.json();

            console.log(
                "================================="
            );

            console.log(
                "DASHBOARD DATABASE RESPONSE:",
                result
            );

            console.log(
                "================================="
            );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Gagal mengambil data dashboard"
                );
            }

            if (!result.success) {
                throw new Error(
                    result.message ||
                    "Data dashboard tidak valid"
                );
            }

            setDashboardData({
                stats: {
                    totalEquipment:
                        Number(
                            result.stats?.totalEquipment || 0
                        ),

                    activeMaintenance:
                        Number(
                            result.stats?.activeMaintenance || 0
                        ),

                    pendingApproval:
                        Number(
                            result.stats?.pendingApproval || 0
                        ),

                    completed:
                        Number(
                            result.stats?.completed || 0
                        ),

                    rejected:
                        Number(
                            result.stats?.rejected || 0
                        ),

                    totalMaintenance:
                        Number(
                            result.stats?.totalMaintenance || 0
                        ),

                    completionRate:
                        Number(
                            result.stats?.completionRate || 0
                        ),

                    equipmentUptime:
                        result.stats?.equipmentUptime ??
                        null,

                    onTimeMaintenance:
                        result.stats?.onTimeMaintenance ??
                        null
                },

                maintenanceTrend:
                    Array.isArray(
                        result.maintenanceTrend
                    )
                        ? result.maintenanceTrend
                        : [],

                maintenanceStatus:
                    Array.isArray(
                        result.maintenanceStatus
                    )
                        ? result.maintenanceStatus
                        : [],

                equipmentHealth:
                    result.equipmentHealth || {
                        good: 0,
                        warning: 0,
                        critical: 0,
                        goodPercentage: 0
                    },

                approvalHistory:
                    Array.isArray(
                        result.approvalHistory
                    )
                        ? result.approvalHistory
                        : [],

                recentMaintenance:
                    Array.isArray(
                        result.recentMaintenance
                    )
                        ? result.recentMaintenance
                        : []
            });

        } catch (err) {

            console.error(
                "DASHBOARD ERROR:",
                err
            );

            setError(
                err.message ||
                "Gagal mengambil data dashboard"
            );

        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {
        loadDashboard();
    }, []);

    // ======================================================
    // STATUS COUNT
    // ======================================================

    const getStatusCount = (status) => {

        const item =
            dashboardData.maintenanceStatus.find(
                (row) =>
                    String(
                        row.status || ""
                    ).toUpperCase() ===
                    status
            );

        return Number(
            item?.total || 0
        );
    };

    // ======================================================
    // STATUS LIST
    // ======================================================

    const statusList = [
        {
            key: "PENDING_SUPERVISOR",
            label: "Pending Supervisor"
        },
        {
            key: "PENDING_MANAGER",
            label: "Pending Manager"
        },
        {
            key: "APPROVED",
            label: "Approved"
        },
        {
            key: "IN_PROGRESS",
            label: "In Progress"
        },
        {
            key: "COMPLETED",
            label: "Completed"
        },
        {
            key: "REJECTED",
            label: "Rejected"
        }
    ];

    const statusChartData =
        statusList.map((item) => ({
            ...item,
            total: getStatusCount(item.key)
        }));

    const maxStatus = Math.max(
        ...statusChartData.map(
            (item) => item.total
        ),
        1
    );

    // ======================================================
    // MONTHLY DATA
    // ======================================================

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

    const maintenanceTrend =
        monthNames.map((month, index) => {

            const found =
                dashboardData.maintenanceTrend.find(
                    (item) =>
                        Number(
                            item.month_number
                        ) === index + 1 ||
                        item.month === month
                );

            return {
                month,
                total:
                    Number(
                        found?.total || 0
                    )
            };
        });

    const maxMonthly = Math.max(
        ...maintenanceTrend.map(
            (item) => item.total
        ),
        1
    );

    // ======================================================
    // EQUIPMENT HEALTH
    // ======================================================

    const equipmentHealth =
        dashboardData.equipmentHealth;

    const goodEquipment =
        Number(
            equipmentHealth.good || 0
        );

    const warningEquipment =
        Number(
            equipmentHealth.warning || 0
        );

    const criticalEquipment =
        Number(
            equipmentHealth.critical || 0
        );

    const goodPercentage =
        Number(
            equipmentHealth.goodPercentage || 0
        );

    // ======================================================
    // NOTIFICATION DATA
    //
    // Semua dibuat dari database.
    // ======================================================

    const notifications = [];

    // ------------------------------------------------------
    // NEW MAINTENANCE
    // ------------------------------------------------------

    const newestMaintenance =
        dashboardData.recentMaintenance[0];

    if (newestMaintenance) {

        notifications.push({
            id:
                `maintenance-${newestMaintenance.id}`,

            title:
                "New maintenance request",

            description:
                newestMaintenance.equipment_name
                    ? `${newestMaintenance.equipment_name} memiliki maintenance request baru.`
                    : "Ada maintenance request baru.",

            time:
                newestMaintenance.created_at,

            type:
                "maintenance",

            detail:
                newestMaintenance.description ||
                "Maintenance request baru."
        });
    }

    // ------------------------------------------------------
    // APPROVAL HISTORY
    // ------------------------------------------------------

    const newestApproval =
        dashboardData.approvalHistory[0];

    if (newestApproval) {

        notifications.push({
            id:
                `approval-${newestApproval.id}`,

            title:
                `${newestApproval.role || "User"} ${newestApproval.action || "Approval"}`,

            description:
                newestApproval.note ||
                `Maintenance #${newestApproval.maintenance_id} memiliki aktivitas approval.`,

            time:
                newestApproval.created_at,

            type:
                "approval",

            detail:
                `Maintenance #${newestApproval.maintenance_id} - ${newestApproval.action}`
        });
    }

    // ------------------------------------------------------
    // EQUIPMENT WARNING
    // ------------------------------------------------------

    if (warningEquipment > 0) {

        notifications.push({
            id:
                "equipment-warning",

            title:
                "Equipment requires attention",

            description:
                `${warningEquipment} equipment sedang dalam status maintenance.`,

            time:
                new Date(),

            type:
                "warning",

            detail:
                `${warningEquipment} equipment berada dalam kategori warning.`
        });
    }

    // ======================================================
    // FORMAT TIME
    // ======================================================

    const formatTime = (dateValue) => {

        if (!dateValue) {
            return "-";
        }

        const date =
            new Date(dateValue);

        if (Number.isNaN(
            date.getTime()
        )) {
            return "-";
        }

        return date.toLocaleString(
            "id-ID",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
    };

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

    const closeNotification = () => {

        setSelectedNotification(
            null
        );
    };

    // ======================================================
    // REFRESH
    // ======================================================

    const refreshDashboard = () => {
        loadDashboard();
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
                    position: "relative"
                }}
            >

                {/* LEFT */}

                <div>

                    <p className="dashboard-label">
                        ADMIN PANEL
                    </p>

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p className="dashboard-description">
                        Monitor seluruh aktivitas
                        equipment dan maintenance
                        system.
                    </p>

                </div>

                {/* RIGHT */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        position: "relative"
                    }}
                >

                    {/* ==================================================
                        NOTIFICATION
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
                            position: "relative",
                            width: "58px",
                            height: "58px",
                            border:
                                "1px solid #dbe3ef",
                            borderRadius: "14px",
                            background: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#475569"
                        }}
                    >

                        <Bell size={23} />

                        {notifications.length > 0 && (
                            <span
                                style={{
                                    position: "absolute",
                                    top: "5px",
                                    right: "5px",
                                    minWidth: "21px",
                                    height: "21px",
                                    padding: "0 5px",
                                    borderRadius: "50%",
                                    background: "#ef4444",
                                    color: "#ffffff",
                                    fontSize: "11px",
                                    fontWeight: "700",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
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
                                position: "absolute",
                                top: "68px",
                                right: "150px",
                                width: "390px",
                                background: "#ffffff",
                                border:
                                    "1px solid #e2e8f0",
                                borderRadius: "16px",
                                boxShadow:
                                    "0 20px 50px rgba(15,23,42,.18)",
                                overflow: "hidden",
                                zIndex: 5000
                            }}
                        >

                            <div
                                style={{
                                    padding:
                                        "18px 20px",
                                    borderBottom:
                                        "1px solid #e2e8f0",
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center"
                                }}
                            >

                                <div>

                                    <h3
                                        style={{
                                            margin: 0,
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
                                        {
                                            notifications.length
                                        }{" "}
                                        notification
                                    </p>

                                </div>

                                <Bell
                                    size={23}
                                    color="#2563eb"
                                />

                            </div>

                            {notifications.length === 0 ? (

                                <div
                                    style={{
                                        padding: "30px",
                                        textAlign: "center",
                                        color:
                                            "#64748b"
                                    }}
                                >
                                    Belum ada
                                    notification.
                                </div>

                            ) : (

                                notifications.map(
                                    (notification) => (

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
                                                width: "100%",
                                                border: "none",
                                                borderBottom:
                                                    "1px solid #f1f5f9",
                                                background:
                                                    "#ffffff",
                                                padding:
                                                    "17px 20px",
                                                display: "flex",
                                                gap: "14px",
                                                alignItems:
                                                    "flex-start",
                                                textAlign:
                                                    "left",
                                                cursor:
                                                    "pointer"
                                            }}
                                        >

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
                                                        formatTime(
                                                            notification.time
                                                        )
                                                    }
                                                </small>

                                            </div>

                                        </button>
                                    )
                                )
                            )}

                            <div
                                style={{
                                    padding: "13px",
                                    textAlign: "center"
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
                                        border: "none",
                                        background:
                                            "transparent",
                                        color: "#2563eb",
                                        fontWeight: "600",
                                        cursor: "pointer"
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

                        <Activity size={18} />

                        <span>
                            System Overview
                        </span>

                    </button>

                </div>

            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div
                    style={{
                        marginBottom: "16px",
                        padding: "13px 16px",
                        borderRadius: "10px",
                        background: "#fef2f2",
                        border:
                            "1px solid #fecaca",
                        color: "#b91c1c",
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        gap: "15px"
                    }}
                >

                    <span>
                        Gagal memuat data:
                        {" "}
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={
                            refreshDashboard
                        }
                        style={{
                            border: "none",
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
                TOP STATISTICS
            ================================================== */}

            <div
                className="dashboard-stat-grid"
            >

                <StatCard
                    title="Total Equipment"
                    value={
                        loading
                            ? "..."
                            : dashboardData.stats
                                  .totalEquipment
                    }
                    subtitle="Registered equipment"
                    icon={
                        <Package size={24} />
                    }
                    variant="blue"
                />

                <StatCard
                    title="Active Maintenance"
                    value={
                        loading
                            ? "..."
                            : dashboardData.stats
                                  .activeMaintenance
                    }
                    subtitle="Currently in progress"
                    icon={
                        <Wrench size={24} />
                    }
                    variant="orange"
                />

                <StatCard
                    title="Pending Approval"
                    value={
                        loading
                            ? "..."
                            : dashboardData.stats
                                  .pendingApproval
                    }
                    subtitle="Supervisor / Manager"
                    icon={
                        <Clock size={24} />
                    }
                    variant="purple"
                />

                <StatCard
                    title="Completed"
                    value={
                        loading
                            ? "..."
                            : dashboardData.stats
                                  .completed
                    }
                    subtitle="Maintenance completed"
                    icon={
                        <CheckCircle size={24} />
                    }
                    variant="green"
                />

            </div>

            {/* ==================================================
                MAINTENANCE PERFORMANCE
            ================================================== */}

            <div
                className="dashboard-card"
                style={{
                    marginTop: "20px"
                }}
            >

                <div
                    className="card-header"
                >

                    <div>

                        <h3>
                            Maintenance Performance
                        </h3>

                        <p>
                            Key performance indicators
                            berdasarkan database
                        </p>

                    </div>

                    <Activity size={20} />

                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(3, minmax(0, 1fr))",
                        gap: "16px",
                        marginTop: "20px"
                    }}
                >

                    {/* COMPLETION RATE */}

                    <div
                        style={{
                            padding: "18px",
                            border:
                                "1px solid #e2e8f0",
                            borderRadius:
                                "14px"
                        }}
                    >

                        <CheckCircle
                            size={25}
                            color="#2563eb"
                        />

                        <p
                            style={{
                                margin:
                                    "12px 0 4px",
                                color:
                                    "#64748b"
                            }}
                        >
                            Completion Rate
                        </p>

                        <strong
                            style={{
                                fontSize:
                                    "28px",
                                color:
                                    "#0f172a"
                            }}
                        >
                            {
                                dashboardData.stats
                                    .completionRate
                            }%
                        </strong>

                    </div>

                    {/* EQUIPMENT UPTIME */}

                    <div
                        style={{
                            padding: "18px",
                            border:
                                "1px solid #e2e8f0",
                            borderRadius:
                                "14px"
                        }}
                    >

                        <Activity
                            size={25}
                            color="#16a34a"
                        />

                        <p
                            style={{
                                margin:
                                    "12px 0 4px",
                                color:
                                    "#64748b"
                            }}
                        >
                            Equipment Uptime
                        </p>

                        <strong
                            style={{
                                fontSize:
                                    "28px",
                                color:
                                    "#0f172a"
                            }}
                        >
                            {
                                dashboardData.stats
                                    .equipmentUptime !==
                                null
                                    ? `${dashboardData.stats.equipmentUptime}%`
                                    : "N/A"
                            }
                        </strong>

                        {dashboardData.stats
                            .equipmentUptime ===
                            null && (
                            <p
                                style={{
                                    margin:
                                        "5px 0 0",
                                    fontSize:
                                        "12px",
                                    color:
                                        "#94a3b8"
                                }}
                            >
                                Data uptime belum
                                tersedia di database
                            </p>
                        )}

                    </div>

                    {/* ON TIME */}

                    <div
                        style={{
                            padding: "18px",
                            border:
                                "1px solid #e2e8f0",
                            borderRadius:
                                "14px"
                        }}
                    >

                        <Activity
                            size={25}
                            color="#7c3aed"
                        />

                        <p
                            style={{
                                margin:
                                    "12px 0 4px",
                                color:
                                    "#64748b"
                            }}
                        >
                            On-Time Maintenance
                        </p>

                        <strong
                            style={{
                                fontSize:
                                    "28px",
                                color:
                                    "#0f172a"
                            }}
                        >
                            {
                                dashboardData.stats
                                    .onTimeMaintenance !==
                                null
                                    ? `${dashboardData.stats.onTimeMaintenance}%`
                                    : "N/A"
                            }
                        </strong>

                        {dashboardData.stats
                            .onTimeMaintenance ===
                            null && (
                            <p
                                style={{
                                    margin:
                                        "5px 0 0",
                                    fontSize:
                                        "12px",
                                    color:
                                        "#94a3b8"
                                }}
                            >
                                Due date belum
                                tersedia di database
                            </p>
                        )}

                    </div>

                </div>

            </div>

            {/* ==================================================
                ANALYTICS
            ================================================== */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "minmax(0, 1.5fr) minmax(0, 1fr)",
                    gap: "20px",
                    marginTop: "20px"
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
                                Monthly maintenance activity
                            </p>

                        </div>

                        <Activity size={20} />

                    </div>

                    {loading ? (

                        <div
                            style={{
                                minHeight:
                                    "280px",
                                display: "flex",
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
                                height: "300px",
                                display: "flex",
                                alignItems:
                                    "flex-end",
                                gap: "10px",
                                padding:
                                    "30px 10px 10px",
                                borderBottom:
                                    "1px solid #e2e8f0"
                            }}
                        >

                            {maintenanceTrend.map(
                                (item) => {

                                    const height =
                                        item.total === 0
                                            ? 4
                                            : Math.max(
                                                (
                                                    item.total /
                                                    maxMonthly
                                                ) * 200,
                                                12
                                            );

                                    return (

                                        <div
                                            key={
                                                item.month
                                            }
                                            style={{
                                                flex: 1,
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
                    EQUIPMENT HEALTH
                ================================================== */}

                <div
                    className="dashboard-card"
                >

                    <div
                        className="card-header"
                    >

                        <div>

                            <h3>
                                Equipment Health
                            </h3>

                            <p>
                                Overall equipment condition
                            </p>

                        </div>

                        <Package size={20} />

                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection:
                                "column",
                            alignItems:
                                "center",
                            marginTop:
                                "20px"
                        }}
                    >

                        {/* DONUT */}

                        <div
                            style={{
                                width:
                                    "220px",
                                height:
                                    "220px",
                                borderRadius:
                                    "50%",
                                background:
                                    `conic-gradient(
                                        #22c55e 0deg ${goodPercentage * 3.6}deg,
                                        #f59e0b ${goodPercentage * 3.6}deg ${(goodPercentage + (
                                            dashboardData.equipmentHealth.warning /
                                            Math.max(
                                                goodEquipment +
                                                warningEquipment +
                                                criticalEquipment,
                                                1
                                            )
                                        ) * 100) * 3.6}deg,
                                        #ef4444 ${(goodPercentage + (
                                            dashboardData.equipmentHealth.warning /
                                            Math.max(
                                                goodEquipment +
                                                warningEquipment +
                                                criticalEquipment,
                                                1
                                            )
                                        ) * 100) * 3.6}deg 360deg
                                    )`,
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center"
                            }}
                        >

                            <div
                                style={{
                                    width:
                                        "140px",
                                    height:
                                        "140px",
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
                                            "34px",
                                        color:
                                            "#0f172a"
                                    }}
                                >
                                    {
                                        goodPercentage
                                    }%
                                </strong>

                                <span
                                    style={{
                                        color:
                                            "#64748b"
                                    }}
                                >
                                    Good
                                </span>

                            </div>

                        </div>

                        {/* LEGEND */}

                        <div
                            style={{
                                width:
                                    "100%",
                                marginTop:
                                    "20px"
                            }}
                        >

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
                                <span>
                                    🟢 Good
                                </span>

                                <strong>
                                    {
                                        goodEquipment
                                    }
                                </strong>
                            </div>

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
                                <span>
                                    🟠 Warning
                                </span>

                                <strong>
                                    {
                                        warningEquipment
                                    }
                                </strong>
                            </div>

                            <div
                                style={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "space-between"
                                }}
                            >
                                <span>
                                    🔴 Critical
                                </span>

                                <strong>
                                    {
                                        criticalEquipment
                                    }
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* ==================================================
                MAINTENANCE STATUS
            ================================================== */}

            <div
                className="dashboard-card"
                style={{
                    marginTop: "20px"
                }}
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
                            dari database
                        </p>

                    </div>

                    <Wrench size={20} />

                </div>

                <div
                    style={{
                        marginTop: "20px"
                    }}
                >

                    {statusChartData.map(
                        (item) => {

                            const percentage =
                                item.total === 0
                                    ? 0
                                    : (
                                        item.total /
                                        maxStatus
                                    ) * 100;

                            let barColor =
                                "#7c3aed";

                            if (
                                item.key ===
                                "COMPLETED"
                            ) {
                                barColor =
                                    "#16a34a";
                            }

                            if (
                                item.key ===
                                "REJECTED"
                            ) {
                                barColor =
                                    "#dc2626";
                            }

                            if (
                                item.key ===
                                "IN_PROGRESS"
                            ) {
                                barColor =
                                    "#ea580c";
                            }

                            if (
                                item.key ===
                                "APPROVED"
                            ) {
                                barColor =
                                    "#2563eb";
                            }

                            if (
                                item.key ===
                                "PENDING_MANAGER"
                            ) {
                                barColor =
                                    "#9333ea";
                            }

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
                                                    barColor,
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

            </div>

            {/* ==================================================
                APPROVAL HISTORY
            ================================================== */}

            <div
                className="dashboard-card"
                style={{
                    marginTop: "20px"
                }}
            >

                <div
                    className="card-header"
                >

                    <div>

                        <h3>
                            Approval History
                        </h3>

                        <p>
                            Riwayat approval Supervisor
                            dan Manager
                        </p>

                    </div>

                    <UserCheck size={20} />

                </div>

                <div
                    style={{
                        marginTop:
                            "20px",
                        overflowX:
                            "auto"
                    }}
                >

                    {dashboardData
                        .approvalHistory
                        .length === 0 ? (

                        <div
                            style={{
                                padding:
                                    "25px",
                                textAlign:
                                    "center",
                                color:
                                    "#64748b"
                            }}
                        >
                            Belum ada approval
                            history.
                        </div>

                    ) : (

                        <table
                            style={{
                                width:
                                    "100%",
                                borderCollapse:
                                    "collapse"
                            }}
                        >

                            <thead>

                                <tr
                                    style={{
                                        borderBottom:
                                            "1px solid #e2e8f0",
                                        textAlign:
                                            "left"
                                    }}
                                >

                                    <th
                                        style={{
                                            padding:
                                                "12px"
                                        }}
                                    >
                                        Maintenance
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "12px"
                                        }}
                                    >
                                        User
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "12px"
                                        }}
                                    >
                                        Role
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "12px"
                                        }}
                                    >
                                        Action
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "12px"
                                        }}
                                    >
                                        Date
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {dashboardData
                                    .approvalHistory
                                    .map(
                                        (item) => (

                                            <tr
                                                key={
                                                    item.id
                                                }
                                                style={{
                                                    borderBottom:
                                                        "1px solid #f1f5f9"
                                                }}
                                            >

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px"
                                                    }}
                                                >
                                                    #
                                                    {
                                                        item.maintenance_id
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px"
                                                    }}
                                                >
                                                    {
                                                        item.username ||
                                                        `User #${item.user_id}`
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px"
                                                    }}
                                                >
                                                    {
                                                        item.role
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px",
                                                        fontWeight:
                                                            "600"
                                                    }}
                                                >
                                                    {
                                                        item.action
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px",
                                                        color:
                                                            "#64748b"
                                                    }}
                                                >
                                                    {
                                                        formatTime(
                                                            item.created_at
                                                        )
                                                    }
                                                </td>

                                            </tr>

                                        )
                                    )}

                            </tbody>

                        </table>
                    )}

                </div>

            </div>

            {/* ==================================================
                RECENT MAINTENANCE
            ================================================== */}

            <div
                className="dashboard-card"
                style={{
                    marginTop: "20px"
                }}
            >

                <div
                    className="card-header"
                >

                    <div>

                        <h3>
                            Recent Maintenance
                        </h3>

                        <p>
                            Maintenance request terbaru
                            dari database
                        </p>

                    </div>

                    <Wrench size={20} />

                </div>

                <div
                    style={{
                        marginTop:
                            "20px",
                        overflowX:
                            "auto"
                    }}
                >

                    {dashboardData
                        .recentMaintenance
                        .length === 0 ? (

                        <div
                            style={{
                                padding:
                                    "25px",
                                textAlign:
                                    "center",
                                color:
                                    "#64748b"
                            }}
                        >
                            Belum ada maintenance
                            request.
                        </div>

                    ) : (

                        <table
                            style={{
                                width:
                                    "100%",
                                borderCollapse:
                                    "collapse"
                            }}
                        >

                            <thead>

                                <tr
                                    style={{
                                        borderBottom:
                                            "1px solid #e2e8f0",
                                        textAlign:
                                            "left"
                                    }}
                                >

                                    <th
                                        style={{
                                            padding:
                                                "12px"
                                        }}
                                    >
                                        Equipment
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "12px"
                                        }}
                                    >
                                        Location
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "12px"
                                        }}
                                    >
                                        Priority
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "12px"
                                        }}
                                    >
                                        Status
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "12px"
                                        }}
                                    >
                                        Created
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {dashboardData
                                    .recentMaintenance
                                    .map(
                                        (item) => (

                                            <tr
                                                key={
                                                    item.id
                                                }
                                                style={{
                                                    borderBottom:
                                                        "1px solid #f1f5f9"
                                                }}
                                            >

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px"
                                                    }}
                                                >

                                                    <strong>
                                                        {
                                                            item.equipment_name ||
                                                            "-"
                                                        }
                                                    </strong>

                                                    <div
                                                        style={{
                                                            fontSize:
                                                                "12px",
                                                            color:
                                                                "#94a3b8"
                                                        }}
                                                    >
                                                        {
                                                            item.equipment_code ||
                                                            "-"
                                                        }
                                                    </div>

                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px"
                                                    }}
                                                >
                                                    {
                                                        item.location ||
                                                        "-"
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px"
                                                    }}
                                                >
                                                    {
                                                        item.priority ||
                                                        "-"
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px"
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            display:
                                                                "inline-block",
                                                            padding:
                                                                "5px 9px",
                                                            borderRadius:
                                                                "999px",
                                                            background:
                                                                "#eff6ff",
                                                            color:
                                                                "#2563eb",
                                                            fontSize:
                                                                "12px",
                                                            fontWeight:
                                                                "600"
                                                        }}
                                                    >
                                                        {
                                                            item.status
                                                        }
                                                    </span>
                                                </td>

                                                <td
                                                    style={{
                                                        padding:
                                                            "12px",
                                                        color:
                                                            "#64748b"
                                                    }}
                                                >
                                                    {
                                                        formatTime(
                                                            item.created_at
                                                        )
                                                    }
                                                </td>

                                            </tr>

                                        )
                                    )}

                            </tbody>

                        </table>
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
                            Current system status
                        </p>

                    </div>

                    <Settings size={20} />

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

                    {/* SYSTEM */}

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

                        <Users size={21} />

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

                        <Activity size={21} />

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
                                    error
                                        ? "#dc2626"
                                        : "#16a34a",
                                fontSize:
                                    "13px"
                            }}
                        >
                            ●{" "}
                            {error
                                ? "Connection Error"
                                : "Connected"}
                        </span>

                    </div>

                </div>

                {/* REFRESH */}

                <button
                    type="button"
                    onClick={
                        refreshDashboard
                    }
                    disabled={loading}
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
                            loading
                                ? "not-allowed"
                                : "pointer",
                        display:
                            "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        gap:
                            "8px"
                    }}
                >

                    <RefreshCw
                        size={17}
                        style={{
                            animation:
                                loading
                                    ? "spin 1s linear infinite"
                                    : "none"
                        }}
                    />

                    {loading
                        ? "Memuat Data..."
                        : "Refresh Data"}

                </button>

            </div>

            {/* ==================================================
                NOTIFICATION DETAIL MODAL
            ================================================== */}

            {selectedNotification && (

                <div
                    style={{
                        position:
                            "fixed",
                        inset: 0,
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
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

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
                                <X size={20} />
                            </button>

                        </div>

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

                        <span
                            style={{
                                color:
                                    "#94a3b8",
                                fontSize:
                                    "13px"
                            }}
                        >
                            {
                                formatTime(
                                    selectedNotification.time
                                )
                            }
                        </span>

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

                            {
                                selectedNotification.detail
                            }

                        </div>

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
                        inset: 0,
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
                        onClick={(event) =>
                            event.stopPropagation()
                        }
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
                                <X size={20} />
                            </button>

                        </div>

                        {/* SYSTEM STATUS */}

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
                                        dashboardData
                                            .stats
                                            .totalEquipment
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
                                        dashboardData
                                            .stats
                                            .activeMaintenance
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
                                        dashboardData
                                            .stats
                                            .pendingApproval
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
                                        dashboardData
                                            .stats
                                            .completed
                                    }
                                </h3>

                                <span>
                                    Completed
                                </span>

                            </div>

                        </div>

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
import {
    Settings,
    Wrench,
    Hourglass,
    CheckCircle2,
    Bell,
    ChevronRight,
    X
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000";

function Dashboard() {

    const navigate = useNavigate();

    // ========================================
    // STATE
    // ========================================

    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const [showNotifications, setShowNotifications] = useState(false);

    const [loading, setLoading] = useState(true);

    // ========================================
    // LOAD MAINTENANCE REQUEST
    // ========================================

    const loadMaintenanceRequests = async () => {

        try {

            const response = await fetch(
                `${API}/api/maintenance`
            );

            if (!response.ok) {
                throw new Error(
                    "Gagal mengambil maintenance request"
                );
            }

            const data = await response.json();

            const requests = Array.isArray(data)
                ? data
                : [];

            setMaintenanceRequests(requests);

            // ========================================
            // NOTIFICATION
            // ========================================

            const pendingRequests = requests.filter(
                (item) =>
                    String(item.status || "")
                        .toUpperCase()
                        .trim() === "PENDING_SUPERVISOR"
            );

            setNotifications(pendingRequests);

        } catch (error) {

            console.error(
                "ERROR LOAD DASHBOARD:",
                error
            );

            setMaintenanceRequests([]);
            setNotifications([]);

        } finally {

            setLoading(false);

        }
    };


    // ========================================
    // LOAD DATA SAAT DASHBOARD DIBUKA
    // ========================================

    useEffect(() => {

        loadMaintenanceRequests();

        // Refresh otomatis setiap 5 detik
        const interval = setInterval(
            loadMaintenanceRequests,
            5000
        );

        return () => {
            clearInterval(interval);
        };

    }, []);


    // ========================================
    // DATA STATISTICS
    // ========================================

    const waitingApprovalCount =
        maintenanceRequests.filter(
            (item) =>
                String(item.status || "")
                    .toUpperCase()
                    .trim() === "PENDING_SUPERVISOR"
        ).length;


    const approvedCount =
        maintenanceRequests.filter(
            (item) =>
                String(item.status || "")
                    .toUpperCase()
                    .trim() === "APPROVED"
        ).length;


    const rejectedCount =
        maintenanceRequests.filter(
            (item) =>
                String(item.status || "")
                    .toUpperCase()
                    .trim() === "REJECTED"
        ).length;


    // ========================================
    // FORMAT STATUS
    // ========================================

    const formatStatus = (status) => {

        switch (
            String(status || "")
                .toUpperCase()
                .trim()
        ) {

            case "PENDING_SUPERVISOR":
                return "Waiting Approval";

            case "APPROVED":
                return "Approved";

            case "REJECTED":
                return "Rejected";

            case "IN_PROGRESS":
                return "In Progress";

            case "COMPLETED":
                return "Completed";

            default:
                return status || "-";
        }
    };


    // ========================================
    // STATUS CLASS
    // ========================================

    const getStatusClass = (status) => {

        return String(status || "")
            .toLowerCase()
            .replaceAll("_", "-")
            .replaceAll(" ", "-");
    };


    // ========================================
    // PRIORITY
    // ========================================

    const getPriority = (priority) => {

        if (!priority) {
            return "Medium";
        }

        return String(priority)
            .charAt(0)
            .toUpperCase() +
            String(priority)
                .slice(1)
                .toLowerCase();
    };


    // ========================================
    // OPEN APPROVAL
    // ========================================

    const openApproval = () => {

        setShowNotifications(false);

        navigate("/approval");
    };


    // ========================================
    // OPEN NOTIFICATION
    // ========================================

    const openNotification = (item) => {

        setShowNotifications(false);

        navigate("/approval", {
            state: {
                maintenanceId: item.id
            }
        });
    };


    // ========================================
    // RENDER
    // ========================================

    return (

        <div className="dashboard">

            {/* ========================================
                HEADER
            ======================================== */}

            <div className="dashboard-header">

                <div>

                    <span className="breadcrumb">
                        Dashboard
                    </span>

                    <h1>
                        Good Morning, Andi 👋
                    </h1>

                    <p>
                        Pantau kondisi equipment dan maintenance perusahaan.
                    </p>

                </div>


                {/* ========================================
                    USER + NOTIFICATION
                ======================================== */}

                <div className="dashboard-user">

                    <div className="notification-wrapper">

                        <button
                            className="notification-button"
                            onClick={() =>
                                setShowNotifications(
                                    !showNotifications
                                )
                            }
                        >

                            <Bell size={18} />

                            {notifications.length > 0 && (
                                <>
                                    <span className="notification-dot"></span>

                                    <span className="notification-count">
                                        {notifications.length}
                                    </span>
                                </>
                            )}

                        </button>


                        {/* ========================================
                            NOTIFICATION DROPDOWN
                        ======================================== */}

                        {showNotifications && (

                            <div className="notification-dropdown">

                                {/* HEADER */}

                                <div className="notification-header">

                                    <div>

                                        <strong>
                                            Notifikasi
                                        </strong>

                                        <span>
                                            {notifications.length} request menunggu approval
                                        </span>

                                    </div>


                                    <button
                                        className="notification-close"
                                        onClick={() =>
                                            setShowNotifications(false)
                                        }
                                    >
                                        <X size={16} />
                                    </button>

                                </div>


                                {/* LIST */}

                                <div className="notification-list">

                                    {notifications.length === 0 ? (

                                        <div className="notification-empty">

                                            <Bell size={24} />

                                            <p>
                                                Tidak ada notifikasi baru.
                                            </p>

                                        </div>

                                    ) : (

                                        notifications.map((item) => (

                                            <button
                                                key={item.id}
                                                className="notification-item"
                                                onClick={() =>
                                                    openNotification(item)
                                                }
                                            >

                                                <div className="notification-item-icon">

                                                    <Wrench size={17} />

                                                </div>


                                                <div className="notification-item-content">

                                                    <strong>
                                                        Maintenance Request Baru
                                                    </strong>

                                                    <span>
                                                        Equipment #
                                                        {item.equipment_id}
                                                    </span>

                                                    <small>
                                                        {item.description || "Maintenance request membutuhkan approval"}
                                                    </small>

                                                </div>


                                                <ChevronRight size={17} />

                                            </button>

                                        ))

                                    )}

                                </div>


                                {/* VIEW ALL */}

                                {notifications.length > 0 && (

                                    <button
                                        className="notification-view-all"
                                        onClick={openApproval}
                                    >

                                        Lihat semua Approval

                                        <ChevronRight size={15} />

                                    </button>

                                )}

                            </div>

                        )}

                    </div>


                    {/* USER */}

                    <div className="user-avatar">
                        AT
                    </div>


                    <div className="user-detail">

                        <strong>
                            Andi Teknisi
                        </strong>

                        <span>
                            Engineer
                        </span>

                    </div>

                </div>

            </div>


            {/* ========================================
                STATISTICS
            ======================================== */}

            <div className="dashboard-statistics">

                {/* TOTAL EQUIPMENT */}

                <div className="dashboard-stat-card">

                    <div className="stat-icon blue">
                        <Settings size={20} />
                    </div>

                    <div>

                        <span>
                            Total Equipment
                        </span>

                        <h2>
                            48
                        </h2>

                        <small>
                            Equipment terdaftar
                        </small>

                    </div>

                </div>


                {/* NEED MAINTENANCE */}

                <div className="dashboard-stat-card">

                    <div className="stat-icon orange">
                        <Wrench size={20} />
                    </div>

                    <div>

                        <span>
                            Need Maintenance
                        </span>

                        <h2>
                            {maintenanceRequests.length}
                        </h2>

                        <small>
                            Maintenance request
                        </small>

                    </div>

                </div>


                {/* WAITING APPROVAL */}

                <div className="dashboard-stat-card">

                    <div className="stat-icon yellow">
                        <Hourglass size={20} />
                    </div>

                    <div>

                        <span>
                            Waiting Approval
                        </span>

                        <h2>
                            {waitingApprovalCount}
                        </h2>

                        <small>
                            Menunggu persetujuan
                        </small>

                    </div>

                </div>


                {/* COMPLETED */}

                <div className="dashboard-stat-card">

                    <div className="stat-icon green">
                        <CheckCircle2 size={20} />
                    </div>

                    <div>

                        <span>
                            Completed
                        </span>

                        <h2>
                            {approvedCount}
                        </h2>

                        <small>
                            Request disetujui
                        </small>

                    </div>

                </div>

            </div>


            {/* ========================================
                MAIN DASHBOARD
            ======================================== */}

            <div className="dashboard-grid">


                {/* ========================================
                    MAINTENANCE REQUEST
                ======================================== */}

                <div className="dashboard-card maintenance-card">

                    <div className="card-title">

                        <div>

                            <h3>
                                Maintenance Request
                            </h3>

                            <p>
                                Equipment yang membutuhkan maintenance
                            </p>

                        </div>


                        <button
                            className="request-button"
                            onClick={() =>
                                navigate("/maintenance")
                            }
                        >
                            + Request Maintenance
                        </button>

                    </div>


                    <div className="request-table">

                        <div className="request-table-header">

                            <span>
                                EQUIPMENT
                            </span>

                            <span>
                                LOCATION
                            </span>

                            <span>
                                PRIORITY
                            </span>

                            <span>
                                STATUS
                            </span>

                            <span>
                                ACTION
                            </span>

                        </div>


                        {/* LOADING */}

                        {loading ? (

                            <div className="request-row">

                                <span>
                                    Memuat data...
                                </span>

                            </div>

                        ) : maintenanceRequests.length === 0 ? (

                            <div className="request-row">

                                <span>
                                    Belum ada maintenance request.
                                </span>

                            </div>

                        ) : (

                            maintenanceRequests
                                .slice(0, 5)
                                .map((item) => (

                                    <div
                                        className="request-row"
                                        key={item.id}
                                    >

                                        {/* EQUIPMENT */}

                                        <div className="equipment-name">

                                            <div className="equipment-icon">

                                                <Settings size={14} />

                                            </div>

                                            <div>

                                                <strong>
                                                    Equipment #
                                                    {item.equipment_id}
                                                </strong>

                                                <small>
                                                    ID #{item.id}
                                                </small>

                                            </div>

                                        </div>


                                        {/* LOCATION */}

                                        <span>
                                            -
                                        </span>


                                        {/* PRIORITY */}

                                        <span>

                                            <span
                                                className={`priority ${getPriority(item.priority).toLowerCase()}`}
                                            >
                                                {getPriority(item.priority)}
                                            </span>

                                        </span>


                                        {/* STATUS */}

                                        <span>

                                            <span
                                                className={`status ${getStatusClass(item.status)}`}
                                            >
                                                {formatStatus(item.status)}
                                            </span>

                                        </span>


                                        {/* ACTION */}

                                        <button
                                            className="detail-button"
                                            onClick={() => {

                                                if (
                                                    String(item.status || "")
                                                        .toUpperCase()
                                                        .trim() ===
                                                    "PENDING_SUPERVISOR"
                                                ) {

                                                    navigate("/approval", {
                                                        state: {
                                                            maintenanceId: item.id
                                                        }
                                                    });

                                                }

                                            }}
                                        >
                                            Detail
                                        </button>

                                    </div>

                                ))

                        )}

                    </div>

                </div>


                {/* ========================================
                    APPROVAL PROGRESS
                ======================================== */}

                <div className="dashboard-card approval-card">

                    <div className="card-title">

                        <div>

                            <h3>
                                Approval Progress
                            </h3>

                            <p>
                                Status request maintenance
                            </p>

                        </div>

                    </div>


                    <div className="approval-progress">

                        <div className="approval-step completed">

                            <div className="step-number">
                                ✓
                            </div>

                            <div>

                                <strong>
                                    Request Created
                                </strong>

                                <span>
                                    Engineer membuat request
                                </span>

                                <small>
                                    -
                                </small>

                            </div>

                        </div>


                        <div className="approval-line"></div>


                        <div
                            className={`approval-step ${
                                waitingApprovalCount === 0
                                    ? "completed"
                                    : "current"
                            }`}
                        >

                            <div className="step-number">
                                {waitingApprovalCount === 0
                                    ? "✓"
                                    : "2"}
                            </div>

                            <div>

                                <strong>
                                    Supervisor Approval
                                </strong>

                                <span>
                                    {waitingApprovalCount > 0
                                        ? `${waitingApprovalCount} request menunggu approval`
                                        : "Tidak ada request menunggu approval"}
                                </span>

                                <small>
                                    {waitingApprovalCount > 0
                                        ? "Waiting..."
                                        : "Done"}
                                </small>

                            </div>

                        </div>


                        <div className="approval-line"></div>


                        <div className="approval-step">

                            <div className="step-number">
                                3
                            </div>

                            <div>

                                <strong>
                                    Maintenance
                                </strong>

                                <span>
                                    Request siap diproses
                                </span>

                                <small>
                                    -
                                </small>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ========================================
                RECENT ACTIVITY
            ======================================== */}

            <div className="dashboard-card recent-card">

                <div className="card-title">

                    <div>

                        <h3>
                            Recent Activity
                        </h3>

                        <p>
                            Aktivitas maintenance terbaru
                        </p>

                    </div>


                    <button
                        className="view-all"
                        onClick={() =>
                            navigate("/history")
                        }
                    >
                        View All
                        <ChevronRight size={14} />
                    </button>

                </div>


                <div className="activity-list">

                    {loading ? (

                        <div className="activity-item">

                            <div className="activity-content">

                                <strong>
                                    Memuat aktivitas...
                                </strong>

                            </div>

                        </div>

                    ) : maintenanceRequests.length === 0 ? (

                        <div className="activity-item">

                            <div className="activity-content">

                                <strong>
                                    Belum ada aktivitas
                                </strong>

                                <span>
                                    Aktivitas maintenance akan muncul di sini.
                                </span>

                            </div>

                        </div>

                    ) : (

                        maintenanceRequests
                            .slice(0, 3)
                            .map((item) => (

                                <div
                                    className="activity-item"
                                    key={item.id}
                                >

                                    <div
                                        className={`activity-icon ${
                                            String(item.status || "")
                                                .toUpperCase()
                                                .trim() === "APPROVED"
                                                ? "approved"
                                                : "request"
                                        }`}
                                    >

                                        {String(item.status || "")
                                            .toUpperCase()
                                            .trim() === "APPROVED" ? (
                                            <CheckCircle2 size={17} />
                                        ) : (
                                            <Wrench size={17} />
                                        )}

                                    </div>


                                    <div className="activity-content">

                                        <strong>
                                            {formatStatus(item.status)}
                                        </strong>

                                        <span>
                                            Equipment #
                                            {item.equipment_id}
                                            {" - "}
                                            {item.description || "Maintenance request"}
                                        </span>

                                    </div>


                                    <time>
                                        #{item.id}
                                    </time>

                                </div>

                            ))

                    )}

                </div>

            </div>

        </div>
    );
}

export default Dashboard;
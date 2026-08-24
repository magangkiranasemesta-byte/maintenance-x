import React, {
    useEffect,
    useState
} from "react";

import {
    CheckSquare,
    Clock,
    Wrench,
    Users,
    TrendingUp,
    AlertTriangle,
    Bell,
    ChevronRight
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";

import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";


const API = "http://localhost:3000";


const SupervisorDashboard = () => {

    // ======================================================
    // NAVIGATION
    // ======================================================

    const navigate = useNavigate();


    // ======================================================
    // APPROVAL STATE
    // ======================================================

    const [approvalCount, setApprovalCount] = useState(0);

    const [approvalLoading, setApprovalLoading] = useState(true);


    // ======================================================
    // FETCH APPROVAL
    // ======================================================

    useEffect(() => {

        let isMounted = true;


        const fetchApprovalCount = async () => {

            try {

                console.log(
                    "Mengambil data maintenance..."
                );


                const response = await fetch(
                    `${API}/api/maintenance`
                );


                console.log(
                    "Status API:",
                    response.status
                );


                if (!response.ok) {

                    throw new Error(
                        `HTTP Error ${response.status}`
                    );

                }


                const data =
                    await response.json();


                console.log(
                    "Data maintenance:",
                    data
                );


                const requests =
                    Array.isArray(data)
                        ? data
                        : Array.isArray(data.data)
                            ? data.data
                            : [];


                console.log(
                    "Total maintenance:",
                    requests.length
                );


                // ==================================================
                // SUPERVISOR APPROVAL
                // ==================================================

                const pendingSupervisor =
                    requests.filter(
                        item =>
                            String(item.status)
                                .toUpperCase()
                                .trim() ===
                            "PENDING_SUPERVISOR"
                    );


                console.log(
                    "PENDING SUPERVISOR:",
                    pendingSupervisor
                );


                console.log(
                    "JUMLAH APPROVAL SUPERVISOR:",
                    pendingSupervisor.length
                );


                if (isMounted) {

                    setApprovalCount(
                        pendingSupervisor.length
                    );

                }


            } catch (error) {

                console.error(
                    "Gagal mengambil approval supervisor:",
                    error
                );


                if (isMounted) {

                    setApprovalCount(0);

                }

            } finally {

                if (isMounted) {

                    setApprovalLoading(false);

                }

            }

        };


        // Fetch pertama

        fetchApprovalCount();


        // Realtime setiap 5 detik

        const interval = setInterval(
            fetchApprovalCount,
            5000
        );


        return () => {

            isMounted = false;

            clearInterval(interval);

        };

    }, []);


    // ======================================================
    // CLICK APPROVAL
    // ======================================================

    const handleApprovalClick = () => {

        navigate("/approval");

    };


    // ======================================================
    // DATA
    // ======================================================

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


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <div className="role-dashboard">


            {/* ==================================================
                APPROVAL NOTIFICATION
            ================================================== */}

            {!approvalLoading && approvalCount > 0 && (

                <div
                    style={{
                        width: "100%",
                        marginBottom: "20px",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        background:
                            "linear-gradient(90deg, #fff7ed, #ffedd5)",
                        border:
                            "1px solid #fed7aa",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        cursor: "pointer",
                        overflow: "hidden",
                        boxSizing: "border-box",
                        boxShadow:
                            "0 4px 12px rgba(0,0,0,0.06)"
                    }}
                    onClick={handleApprovalClick}
                >


                    {/* ICON */}

                    <div
                        style={{
                            position: "relative",
                            minWidth: "42px",
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            background: "#f97316",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >

                        <Bell
                            size={21}
                            strokeWidth={2.5}
                        />


                        <span
                            style={{
                                position: "absolute",
                                top: "-6px",
                                right: "-6px",
                                minWidth: "21px",
                                height: "21px",
                                padding: "0 5px",
                                borderRadius: "20px",
                                background: "#dc2626",
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

                            {approvalCount > 99
                                ? "99+"
                                : approvalCount}

                        </span>

                    </div>


                    {/* MOVING TEXT */}

                    <div
                        style={{
                            flex: 1,
                            minWidth: 0,
                            overflow: "hidden",
                            whiteSpace: "nowrap"
                        }}
                    >

                        <div
                            style={{
                                display: "inline-block",
                                animation:
                                    "supervisorApprovalMarquee 14s linear infinite",
                                fontSize: "14px",
                                color: "#9a3412",
                                fontWeight: "600"
                            }}
                        >

                            🔔 Ada{" "}

                            <strong>
                                {approvalCount}
                            </strong>{" "}

                            maintenance yang menunggu
                            approval Supervisor
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            •
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            Klik untuk melihat approval
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            •
                            &nbsp;&nbsp;&nbsp;&nbsp;

                            🔔 Ada{" "}

                            <strong>
                                {approvalCount}
                            </strong>{" "}

                            maintenance yang menunggu
                            approval Supervisor

                        </div>

                    </div>


                    {/* BUTTON */}

                    <div
                        style={{
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding:
                                "8px 12px",
                            borderRadius: "8px",
                            background: "#f97316",
                            color: "#ffffff",
                            fontSize: "13px",
                            fontWeight: "600"
                        }}
                    >

                        <span>
                            Lihat Approval
                        </span>


                        <ChevronRight
                            size={17}
                        />

                    </div>

                </div>

            )}


            {/* ==================================================
                HEADER
            ================================================== */}

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


            {/* ==================================================
                STATISTICS
            ================================================== */}

            <div className="dashboard-stat-grid">

                <StatCard
                    title="Maintenance Requests"
                    value="14"
                    subtitle="Total requests"
                    icon={
                        <Wrench size={24} />
                    }
                    variant="blue"
                />


                <StatCard
                    title="Pending Approval"
                    value={approvalCount}
                    subtitle="Waiting for review"
                    icon={
                        <Clock size={24} />
                    }
                    variant="orange"
                />


                <StatCard
                    title="On Progress"
                    value="7"
                    subtitle="Currently active"
                    icon={
                        <TrendingUp size={24} />
                    }
                    variant="purple"
                />


                <StatCard
                    title="Completed"
                    value="42"
                    subtitle="Completed maintenance"
                    icon={
                        <CheckSquare size={24} />
                    }
                    variant="green"
                />

            </div>


            {/* ==================================================
                APPROVAL REQUESTS
            ================================================== */}

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

                            {approvalRequests.map(
                                (request) => (

                                    <tr
                                        key={request.id}
                                    >

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
                                                status={
                                                    request.status
                                                }
                                            />

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ==================================================
                TEAM + PROGRESS
            ================================================== */}

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

                        {engineers.map(
                            (engineer) => (

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
                                                {engineer.tasks}
                                                {" "}
                                                active tasks
                                            </span>

                                        </div>

                                    </div>


                                    <div className="performance-value">

                                        {engineer.completion}%

                                    </div>

                                </div>

                            )
                        )}

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
                                {approvalCount}
                            </strong>

                            <span>
                                Pending
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                ALERT
            ================================================== */}

            {approvalCount > 0 && (

                <div className="dashboard-alert">

                    <AlertTriangle size={20} />

                    <div>

                        <strong>
                            Attention Required
                        </strong>

                        <p>

                            There are{" "}

                            <strong>
                                {approvalCount}
                            </strong>{" "}

                            maintenance requests
                            waiting for approval.

                        </p>

                    </div>

                </div>

            )}

            {/* ==================================================
                MARQUEE ANIMATION
            ================================================== */}

            <style>
                {`
                    @keyframes supervisorApprovalMarquee {

                        0% {
                            transform: translateX(100%);
                        }

                        100% {
                            transform: translateX(-100%);
                        }

                    }
                `}
            </style>

        </div>

    );

};


export default SupervisorDashboard;
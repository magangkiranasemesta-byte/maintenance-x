import {
    Settings,
    Wrench,
    Hourglass,
    CheckCircle2,
    Bell,
    ChevronRight
} from "lucide-react";

function Dashboard() {

    const maintenanceRequests = [
        {
            equipment: "AC Unit 01",
            code: "EQ-001",
            location: "Ruang Server",
            priority: "High",
            status: "Waiting Approval"
        },
        {
            equipment: "Generator 01",
            code: "EQ-002",
            location: "Basement",
            priority: "Medium",
            status: "Approved"
        },
        {
            equipment: "Compressor 01",
            code: "EQ-003",
            location: "Workshop",
            priority: "Low",
            status: "In Progress"
        }
    ];

    return (

        <div className="dashboard">

            {/* HEADER */}

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


                <div className="dashboard-user">

                    <button className="notification-button">
                        <Bell size={18} />

                        <span className="notification-dot"></span>
                    </button>


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


            {/* STATISTICS */}

            <div className="dashboard-statistics">

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


                <div className="dashboard-stat-card">

                    <div className="stat-icon orange">
                        <Wrench size={20} />
                    </div>

                    <div>

                        <span>
                            Need Maintenance
                        </span>

                        <h2>
                            8
                        </h2>

                        <small>
                            Perlu pemeriksaan
                        </small>

                    </div>

                </div>


                <div className="dashboard-stat-card">

                    <div className="stat-icon yellow">
                        <Hourglass size={20} />
                    </div>

                    <div>

                        <span>
                            Waiting Approval
                        </span>

                        <h2>
                            3
                        </h2>

                        <small>
                            Menunggu persetujuan
                        </small>

                    </div>

                </div>


                <div className="dashboard-stat-card">

                    <div className="stat-icon green">
                        <CheckCircle2 size={20} />
                    </div>

                    <div>

                        <span>
                            Completed
                        </span>

                        <h2>
                            37
                        </h2>

                        <small>
                            Selesai bulan ini
                        </small>

                    </div>

                </div>

            </div>


            {/* MAIN DASHBOARD */}

            <div className="dashboard-grid">


                {/* MAINTENANCE REQUEST */}

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


                        <button className="request-button">
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


                        {maintenanceRequests.map((item, index) => (

                            <div
                                className="request-row"
                                key={index}
                            >

                                <div className="equipment-name">

                                    <div className="equipment-icon">
                                        <Settings size={14} />
                                    </div>

                                    <div>

                                        <strong>
                                            {item.equipment}
                                        </strong>

                                        <small>
                                            {item.code}
                                        </small>

                                    </div>

                                </div>


                                <span>
                                    {item.location}
                                </span>


                                <span>

                                    <span
                                        className={`priority ${item.priority.toLowerCase()}`}
                                    >
                                        {item.priority}
                                    </span>

                                </span>


                                <span>

                                    <span
                                        className={`status ${item.status
                                            .toLowerCase()
                                            .replaceAll(" ", "-")}`}
                                    >
                                        {item.status}
                                    </span>

                                </span>


                                <button className="detail-button">
                                    Detail
                                </button>

                            </div>

                        ))}

                    </div>

                </div>


                {/* APPROVAL PROGRESS */}

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
                                    08:30
                                </small>

                            </div>

                        </div>


                        <div className="approval-line"></div>


                        <div className="approval-step completed">

                            <div className="step-number">
                                ✓
                            </div>

                            <div>

                                <strong>
                                    Supervisor Approved
                                </strong>

                                <span>
                                    Request disetujui Supervisor
                                </span>

                                <small>
                                    09:15
                                </small>

                            </div>

                        </div>


                        <div className="approval-line"></div>


                        <div className="approval-step current">

                            <div className="step-number">
                                3
                            </div>

                            <div>

                                <strong>
                                    Manager Approval
                                </strong>

                                <span>
                                    Menunggu approval Manager
                                </span>

                                <small>
                                    Waiting...
                                </small>

                            </div>

                        </div>


                        <div className="approval-line"></div>


                        <div className="approval-step">

                            <div className="step-number">
                                4
                            </div>

                            <div>

                                <strong>
                                    Maintenance
                                </strong>

                                <span>
                                    Belum dimulai
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* RECENT ACTIVITY */}

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


                    <button className="view-all">
                        View All <ChevronRight size={14} />
                    </button>

                </div>


                <div className="activity-list">

                    <div className="activity-item">

                        <div className="activity-icon completed">
                            <CheckCircle2 size={17} />
                        </div>

                        <div className="activity-content">

                            <strong>
                                Maintenance Completed
                            </strong>

                            <span>
                                Generator 02 berhasil dilakukan maintenance.
                            </span>

                        </div>

                        <time>
                            10 min ago
                        </time>

                    </div>


                    <div className="activity-item">

                        <div className="activity-icon request">
                            <Wrench size={17} />
                        </div>

                        <div className="activity-content">

                            <strong>
                                Maintenance Request
                            </strong>

                            <span>
                                AC Unit 01 membutuhkan maintenance.
                            </span>

                        </div>

                        <time>
                            1 hour ago
                        </time>

                    </div>


                    <div className="activity-item">

                        <div className="activity-icon approved">
                            <CheckCircle2 size={17} />
                        </div>

                        <div className="activity-content">

                            <strong>
                                Supervisor Approved
                            </strong>

                            <span>
                                Request EQ-002 telah disetujui.
                            </span>

                        </div>

                        <time>
                            2 hours ago
                        </time>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;
import { useEffect, useState } from "react";
import { getEquipment, getMaintenance } from "../api/api";

function Index() {
    const [equipment, setEquipment] = useState([]);
    const [maintenance, setMaintenance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [equipmentData, maintenanceData] =
                    await Promise.all([
                        getEquipment(),
                        getMaintenance()
                    ]);

                setEquipment(equipmentData);
                setMaintenance(maintenanceData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const totalEquipment = equipment.length;

    const needMaintenance = maintenance.filter(
        item =>
            item.status === "PENDING" ||
            item.status === "WAITING_APPROVAL"
    ).length;

    const waitingApproval = maintenance.filter(
        item => item.status === "WAITING_APPROVAL"
    ).length;

    const completed = maintenance.filter(
        item => item.status === "COMPLETED"
    ).length;

    if (loading) {
        return <div>Memuat dashboard...</div>;
    }

    return (
        <div className="dashboard">

            {/* HEADER */}
            <header className="dashboard-header">
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
                        🔔
                        <span className="notification-dot"></span>
                    </button>

                    <div className="user-avatar">
                        AT
                    </div>

                    <div className="user-detail">
                        <strong>Andi Teknisi</strong>
                        <span>Engineer</span>
                    </div>
                </div>
            </header>

            {/* STATISTICS */}
            <section className="dashboard-statistics">

                <div className="dashboard-stat-card">
                    <div className="stat-icon blue">
                        ⚙
                    </div>

                    <div>
                        <span>Total Equipment</span>
                        <h2>{totalEquipment}</h2>
                        <small>Equipment terdaftar</small>
                    </div>
                </div>

                <div className="dashboard-stat-card">
                    <div className="stat-icon orange">
                        🔧
                    </div>

                    <div>
                        <span>Need Maintenance</span>
                        <h2>{needMaintenance}</h2>
                        <small>Perlu pemeriksaan</small>
                    </div>
                </div>

                <div className="dashboard-stat-card">
                    <div className="stat-icon yellow">
                        ⏳
                    </div>

                    <div>
                        <span>Waiting Approval</span>
                        <h2>{waitingApproval}</h2>
                        <small>Menunggu persetujuan</small>
                    </div>
                </div>

                <div className="dashboard-stat-card">
                    <div className="stat-icon green">
                        ✓
                    </div>

                    <div>
                        <span>Completed</span>
                        <h2>{completed}</h2>
                        <small>Selesai</small>
                    </div>
                </div>

            </section>

            {/* MAINTENANCE REQUEST */}
            <section className="dashboard-grid">

                <div className="dashboard-card">

                    <div className="card-title">
                        <div>
                            <h3>Maintenance Request</h3>
                            <p>
                                Equipment yang membutuhkan maintenance
                            </p>
                        </div>

                        <button className="request-button">
                            + Request Maintenance
                        </button>
                    </div>

                    <div className="request-table-header">
                        <span>EQUIPMENT</span>
                        <span>LOCATION</span>
                        <span>PRIORITY</span>
                        <span>STATUS</span>
                        <span>ACTION</span>
                    </div>

                    {maintenance.slice(0, 5).map(item => {

                        const eq = equipment.find(
                            e => e.id === item.equipment_id
                        );

                        return (
                            <div
                                className="request-row"
                                key={item.id}
                            >

                                <div className="equipment-name">

                                    <div className="equipment-icon">
                                        ⚙
                                    </div>

                                    <div>
                                        <strong>
                                            {eq?.name || `Equipment #${item.equipment_id}`}
                                        </strong>

                                        <small>
                                            {eq?.equipment_code || "-"}
                                        </small>
                                    </div>

                                </div>

                                <span>
                                    {eq?.location || "-"}
                                </span>

                                <span>
                                    <span
                                        className={`priority ${item.priority?.toLowerCase()}`}
                                    >
                                        {item.priority}
                                    </span>
                                </span>

                                <span>
                                    <span
                                        className={`status ${item.status
                                            ?.toLowerCase()
                                            .replaceAll("_", "-")}`}
                                    >
                                        {item.status}
                                    </span>
                                </span>

                                <button className="detail-button">
                                    Detail
                                </button>

                            </div>
                        );
                    })}

                </div>

                {/* APPROVAL */}
                <div className="dashboard-card">

                    <div className="card-title">
                        <div>
                            <h3>Approval Progress</h3>
                            <p>Status request maintenance</p>
                        </div>
                    </div>

                    <div className="approval-progress">

                        <div className="approval-step completed">
                            <div className="step-number">✓</div>

                            <div>
                                <strong>Request Created</strong>
                                <span>Engineer membuat request</span>
                            </div>
                        </div>

                        <div className="approval-line"></div>

                        <div className="approval-step completed">
                            <div className="step-number">✓</div>

                            <div>
                                <strong>Supervisor Approved</strong>
                                <span>Request disetujui Supervisor</span>
                            </div>
                        </div>

                        <div className="approval-line"></div>

                        <div className="approval-step current">
                            <div className="step-number">3</div>

                            <div>
                                <strong>Manager Approval</strong>
                                <span>Menunggu approval Manager</span>
                            </div>
                        </div>

                        <div className="approval-line"></div>

                        <div className="approval-step">
                            <div className="step-number">4</div>

                            <div>
                                <strong>Maintenance</strong>
                                <span>Belum dimulai</span>
                            </div>
                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Index;
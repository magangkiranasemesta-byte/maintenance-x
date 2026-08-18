import { useEffect, useState } from "react";
import {
    History as HistoryIcon,
    CheckCircle,
    XCircle,
    Clock,
    Wrench
} from "lucide-react";

const API = "http://localhost:3000";

function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadHistory = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API}/api/maintenance/history`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Gagal mengambil history"
                );
            }

            setHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Load history error:", err);
            setError(err.message);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case "APPROVED":
                return <CheckCircle size={18} />;

            case "REJECTED":
                return <XCircle size={18} />;

            case "IN_PROGRESS":
                return <Wrench size={18} />;

            default:
                return <Clock size={18} />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "APPROVED":
                return "approved";

            case "REJECTED":
                return "rejected";

            case "IN_PROGRESS":
                return "progress";

            default:
                return "pending";
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="history-page">

            {/* HEADER */}
            <div className="history-page-header">
                <div>
                    <span className="page-label">
                        History
                    </span>

                    <h1>
                        History
                    </h1>

                    <p>
                        Riwayat seluruh aktivitas maintenance equipment.
                    </p>
                </div>
            </div>


            {/* CONTENT */}
            <div className="history-card">

                <div className="history-card-header">
                    <div>
                        <h3>
                            Maintenance History
                        </h3>

                        <p>
                            Riwayat request maintenance yang telah diproses.
                        </p>
                    </div>

                    <div className="history-header-icon">
                        <HistoryIcon size={22} />
                    </div>
                </div>


                {/* ERROR */}
                {error && (
                    <div className="history-error">
                        {error}
                    </div>
                )}


                {/* LOADING */}
                {loading ? (
                    <div className="history-empty">
                        <Clock size={24} />

                        <h3>
                            Memuat history...
                        </h3>
                    </div>
                ) : history.length === 0 ? (
                    <div className="history-empty">
                        <HistoryIcon size={28} />

                        <h3>
                            Belum ada history
                        </h3>

                        <p>
                            Request maintenance yang sudah diproses
                            akan muncul di sini.
                        </p>
                    </div>
                ) : (
                    <div className="history-table-wrapper">
                        <table className="history-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>EQUIPMENT</th>
                                    <th>ENGINEER</th>
                                    <th>DESCRIPTION</th>
                                    <th>ACTION</th>
                                    <th>STATUS</th>
                                    <th>TANGGAL</th>
                                </tr>
                            </thead>

                            <tbody>
                                {history.map((item) => (
                                    <tr key={item.id}>

                                        <td>
                                            {item.maintenance_id}
                                        </td>

                                        <td>
                                            <div className="history-equipment">
                                                <div className="history-equipment-icon">
                                                    <Wrench size={15} />
                                                </div>

                                                <span>
                                                    {item.equipment_name ||
                                                        `Equipment #${item.equipment_id}`}
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            {item.engineer_name ||
                                                item.engineer_id ||
                                                "-"}
                                        </td>

                                        <td>
                                            {item.description || "-"}
                                        </td>

                                        <td>
                                            {item.action || "-"}
                                        </td>

                                        <td>
                                            <span
                                                className={`history-status ${getStatusClass(
                                                    item.status
                                                )}`}
                                            >
                                                {getStatusIcon(item.status)}

                                                {item.status || "-"}
                                            </span>
                                        </td>

                                        <td>
                                            {formatDate(
                                                item.completed_at ||
                                                item.created_at
                                            )}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}

            </div>
        </div>
    );
}

export default History;
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Wrench } from "lucide-react";

const API = "http://localhost:3000";

function Approval() {

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const [processingId, setProcessingId] = useState(null);


    // =========================
    // ALERT
    // =========================

    const showAlert = (text, type) => {

        setMessage(text);
        setMessageType(type);

        setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 3500);

    };


    // =========================
    // LOAD MAINTENANCE REQUEST
    // =========================

    const loadRequests = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                `${API}/api/maintenance`
            );

            if (!response.ok) {
                throw new Error(
                    "Gagal mengambil data maintenance"
                );
            }

            const data = await response.json();

           const waitingApproval = Array.isArray(data)
    ? data.filter(
        (item) =>
            String(item.status || "")
                .toUpperCase()
                .trim() === "PENDING_SUPERVISOR"
    )
                : [];

            setRequests(waitingApproval);

        } catch (error) {

            console.error(
                "Load approval error:",
                error
            );

            setRequests([]);

            showAlert(
                error.message,
                "error"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        loadRequests();

    }, []);


    // =========================
    // UPDATE STATUS
    // =========================

    const updateStatus = async (
        id,
        status
    ) => {

        try {

            setProcessingId(id);

            const response = await fetch(
                `${API}/api/maintenance/${id}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        status: status,
                    }),
                }
            );

            const result =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Gagal mengubah status request"
                );

            }


            if (status === "APPROVED") {

                showAlert(
                    "Maintenance request berhasil disetujui.",
                    "success"
                );

            } else {

                showAlert(
                    "Maintenance request berhasil ditolak.",
                    "success"
                );

            }


            loadRequests();

        } catch (error) {

            console.error(
                "Update approval error:",
                error
            );

            showAlert(
                error.message,
                "error"
            );

        } finally {

            setProcessingId(null);

        }

    };


    // =========================
    // APPROVE
    // =========================

    const handleApprove = (id) => {

        const confirmApprove =
            window.confirm(
                "Apakah kamu yakin ingin menyetujui request maintenance ini?"
            );

        if (!confirmApprove) {
            return;
        }

        updateStatus(
            id,
            "APPROVED"
        );

    };


    // =========================
    // REJECT
    // =========================

    const handleReject = (id) => {

        const confirmReject =
            window.confirm(
                "Apakah kamu yakin ingin menolak request maintenance ini?"
            );

        if (!confirmReject) {
            return;
        }

        updateStatus(
            id,
            "REJECTED"
        );

    };


    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString(
            "id-ID"
        );

    };


    return (

        <div className="approval-page">


            {/* =========================
                HEADER
            ========================= */}

            <div className="approval-page-header">

                <div>

                    <span className="page-label">
                        Approval
                    </span>

                    <h1>
                        Maintenance Approval
                    </h1>

                    <p>
                        Kelola persetujuan maintenance request.
                    </p>

                </div>

            </div>


            {/* =========================
                ALERT
            ========================= */}

            {message && (

                <div
                    className={`approval-alert ${messageType}`}
                >
                    {message}
                </div>

            )}


            {/* =========================
                SUMMARY
            ========================= */}

            <div className="approval-summary">

                <div className="approval-summary-card">

                    <div className="approval-summary-icon waiting">

                        <Clock size={20} />

                    </div>

                    <div>

                        <span>
                            Waiting Approval
                        </span>

                        <strong>
                            {requests.length}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =========================
                TABLE
            ========================= */}

            <div className="approval-content-card">

                <div className="approval-table-wrap">

                    <table className="approval-table">

                        <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    EQUIPMENT
                                </th>

                                <th>
                                    ENGINEER
                                </th>

                                <th>
                                    DESCRIPTION
                                </th>

                                <th>
                                    PRIORITY
                                </th>

                                <th>
                                    STATUS
                                </th>

                                <th>
                                    TANGGAL
                                </th>

                                <th>
                                    ACTION
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="approval-table-message"
                                    >
                                        Memuat data...
                                    </td>

                                </tr>

                            ) : requests.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="approval-table-message"
                                    >

                                        <div className="approval-empty">

                                            <CheckCircle
                                                size={32}
                                            />

                                            <strong>
                                                Tidak ada request
                                            </strong>

                                            <span>
                                                Semua maintenance request sudah diproses.
                                            </span>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                requests.map(
                                    (item) => (

                                        <tr
                                            key={item.id}
                                        >

                                            {/* ID */}

                                            <td>
                                                #{item.id}
                                            </td>


                                            {/* EQUIPMENT */}

                                            <td>

                                                <div className="approval-equipment">

                                                    <div className="approval-equipment-icon">

                                                        <Wrench
                                                            size={14}
                                                        />

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            Equipment #
                                                            {item.equipment_id}
                                                        </strong>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* ENGINEER */}

                                            <td>
                                                Engineer #
                                                {item.engineer_id}
                                            </td>


                                            {/* DESCRIPTION */}

                                            <td>
                                                {item.description || "-"}
                                            </td>


                                            {/* PRIORITY */}

                                            <td>

                                                <span
                                                    className={`approval-priority ${
                                                        String(
                                                            item.priority || ""
                                                        ).toLowerCase()
                                                    }`}
                                                >
                                                    {item.priority}
                                                </span>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span className="approval-status waiting">

                                                    <Clock
                                                        size={13}
                                                    />

                                                    {item.status}

                                                </span>

                                            </td>


                                            {/* DATE */}

                                            <td>
                                                {formatDate(
                                                    item.created_at
                                                )}
                                            </td>


                                            {/* ACTION */}

                                            <td>

                                                <div className="approval-actions">

                                                    <button
                                                        type="button"
                                                        className="approve-btn"
                                                        disabled={
                                                            processingId ===
                                                            item.id
                                                        }
                                                        onClick={() =>
                                                            handleApprove(
                                                                item.id
                                                            )
                                                        }
                                                    >

                                                        <CheckCircle
                                                            size={15}
                                                        />

                                                        Approve

                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="reject-btn"
                                                        disabled={
                                                            processingId ===
                                                            item.id
                                                        }
                                                        onClick={() =>
                                                            handleReject(
                                                                item.id
                                                            )
                                                        }
                                                    >

                                                        <XCircle
                                                            size={15}
                                                        />

                                                        Reject

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}


export default Approval;
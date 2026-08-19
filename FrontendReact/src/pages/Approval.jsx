import { useEffect, useState } from "react";

import {
    CheckCircle,
    XCircle,
    Clock,
    Wrench,
    UserCheck,
    ShieldCheck
} from "lucide-react";


const API = "http://localhost:3000";


function Approval() {

    // =====================================================
    // USER / ROLE
    // =====================================================

    const storedUser =
        localStorage.getItem("user");


    let user = null;


    try {

        user = storedUser
            ? JSON.parse(storedUser)
            : null;

    } catch (error) {

        console.error(
            "Gagal membaca user:",
            error
        );

    }


    const role =
        String(
            user?.role || ""
        )
            .toLowerCase()
            .trim();


    const isSupervisor =
        role === "supervisor";


    const isManager =
        role === "manager";


    // =====================================================
    // STATE
    // =====================================================

    const [
        requests,
        setRequests
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        message,
        setMessage
    ] = useState("");


    const [
        messageType,
        setMessageType
    ] = useState("");


    const [
        processingId,
        setProcessingId
    ] = useState(null);


    // =====================================================
    // ALERT
    // =====================================================

    const showAlert = (
        text,
        type
    ) => {

        setMessage(text);

        setMessageType(type);


        setTimeout(() => {

            setMessage("");

            setMessageType("");

        }, 3500);

    };


    // =====================================================
    // STATUS YANG HARUS DILIHAT BERDASARKAN ROLE
    // =====================================================

    const getWaitingStatus = () => {

        if (isSupervisor) {

            return "PENDING_SUPERVISOR";

        }


        if (isManager) {

            return "WAITING_MANAGER_APPROVAL";

        }


        return "";

    };


    // =====================================================
    // JUDUL BERDASARKAN ROLE
    // =====================================================

    const getPageTitle = () => {

        if (isSupervisor) {

            return "Supervisor Approval";

        }


        if (isManager) {

            return "Manager Approval";

        }


        return "Maintenance Approval";

    };


    const getPageDescription = () => {

        if (isSupervisor) {

            return (
                "Review dan setujui maintenance request sebelum diteruskan ke manager."
            );

        }


        if (isManager) {

            return (
                "Review maintenance request yang telah disetujui supervisor."
            );

        }


        return (
            "Kelola persetujuan maintenance request."
        );

    };


    // =====================================================
    // LOAD REQUEST
    // =====================================================

    const loadRequests = async () => {

        try {

            setLoading(true);


            const response =
                await fetch(
                    `${API}/api/maintenance`
                );


            if (!response.ok) {

                throw new Error(
                    "Gagal mengambil data maintenance"
                );

            }


            const data =
                await response.json();


            const waitingStatus =
                getWaitingStatus();


            const waitingApproval =
                Array.isArray(data)

                    ? data.filter(
                        (item) =>

                            String(
                                item.status || ""
                            )
                                .toUpperCase()
                                .trim() ===
                            waitingStatus
                    )

                    : [];


            setRequests(
                waitingApproval
            );


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


    // =====================================================
    // LOAD SAAT HALAMAN DIBUKA
    // =====================================================

    useEffect(() => {

        loadRequests();

    }, [role]);


    // =====================================================
    // UPDATE STATUS
    // =====================================================

    const updateStatus = async (
        id,
        status
    ) => {

        try {

            setProcessingId(id);


            const response =
                await fetch(
                    `${API}/api/maintenance/${id}/status`,
                    {

                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({
                                status: status
                            })

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


            // =========================================
            // SUPERVISOR APPROVE
            // =========================================

            if (
                isSupervisor &&
                status ===
                    "WAITING_MANAGER_APPROVAL"
            ) {

                showAlert(
                    "Request berhasil disetujui Supervisor dan diteruskan ke Manager.",
                    "success"
                );

            }


            // =========================================
            // MANAGER APPROVE
            // =========================================

            else if (
                isManager &&
                status === "APPROVED"
            ) {

                showAlert(
                    "Request berhasil disetujui Manager.",
                    "success"
                );

            }


            // =========================================
            // REJECT
            // =========================================

            else if (
                status === "REJECTED"
            ) {

                showAlert(
                    "Maintenance request berhasil ditolak.",
                    "success"
                );

            }


            // Refresh data

            await loadRequests();


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

            setProcessingId(
                null
            );

        }

    };


    // =====================================================
    // SUPERVISOR APPROVE
    // =====================================================

    const handleSupervisorApprove = (
        id
    ) => {

        const confirmApprove =
            window.confirm(
                "Apakah kamu yakin ingin menyetujui request ini dan meneruskannya ke Manager?"
            );


        if (!confirmApprove) {

            return;

        }


        updateStatus(
            id,
            "WAITING_MANAGER_APPROVAL"
        );

    };


    // =====================================================
    // MANAGER APPROVE
    // =====================================================

    const handleManagerApprove = (
        id
    ) => {

        const confirmApprove =
            window.confirm(
                "Apakah kamu yakin ingin menyetujui maintenance request ini?"
            );


        if (!confirmApprove) {

            return;

        }


        updateStatus(
            id,
            "APPROVED"
        );

    };


    // =====================================================
    // REJECT
    // =====================================================

    const handleReject = (
        id
    ) => {

        const confirmReject =
            window.confirm(
                "Apakah kamu yakin ingin menolak maintenance request ini?"
            );


        if (!confirmReject) {

            return;

        }


        updateStatus(
            id,
            "REJECTED"
        );

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (
        date
    ) => {

        if (!date) {

            return "-";

        }


        return new Date(
            date
        ).toLocaleString(
            "id-ID"
        );

    };


    // =====================================================
    // ROLE TIDAK DIKENALI
    // =====================================================

    if (
        !isSupervisor &&
        !isManager
    ) {

        return (

            <div
                className="approval-page"
            >

                <div
                    className="approval-content-card"
                    style={{
                        padding:
                            "50px",
                        textAlign:
                            "center"
                    }}
                >

                    <ShieldCheck
                        size={50}
                        color="#64748b"
                    />


                    <h2>
                        Approval Tidak Tersedia
                    </h2>


                    <p>
                        Halaman approval hanya
                        dapat digunakan oleh
                        Supervisor dan Manager.
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div
            className="approval-page"
        >


            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="approval-page-header"
            >

                <div>

                    <span
                        className="page-label"
                    >

                        {isSupervisor
                            ? "SUPERVISOR"
                            : "MANAGER"}

                    </span>


                    <h1>

                        {getPageTitle()}

                    </h1>


                    <p>

                        {getPageDescription()}

                    </p>

                </div>


                {/* ROLE BADGE */}

                <div
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap:
                            "10px",

                        padding:
                            "12px 18px",

                        borderRadius:
                            "12px",

                        background:
                            isSupervisor
                                ? "#eff6ff"
                                : "#f5f3ff",

                        color:
                            isSupervisor
                                ? "#2563eb"
                                : "#7c3aed",

                        fontWeight:
                            "600"
                    }}
                >

                    {isSupervisor ? (

                        <UserCheck
                            size={20}
                        />

                    ) : (

                        <ShieldCheck
                            size={20}
                        />

                    )}


                    {isSupervisor
                        ? "Supervisor"
                        : "Manager"}

                </div>

            </div>


            {/* =================================================
                ALERT
            ================================================= */}

            {message && (

                <div
                    className={
                        `approval-alert ${messageType}`
                    }
                >

                    {message}

                </div>

            )}


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div
                className="approval-summary"
            >

                <div
                    className="approval-summary-card"
                >

                    <div
                        className="approval-summary-icon waiting"
                    >

                        <Clock
                            size={20}
                        />

                    </div>


                    <div>

                        <span>

                            {isSupervisor
                                ? "Waiting Supervisor Approval"
                                : "Waiting Manager Approval"}

                        </span>


                        <strong>

                            {
                                requests.length
                            }

                        </strong>

                    </div>

                </div>


                {/* ROLE FLOW */}

                <div
                    className="approval-summary-card"
                >

                    <div
                        className="approval-summary-icon waiting"
                    >

                        {isSupervisor ? (

                            <UserCheck
                                size={20}
                            />

                        ) : (

                            <ShieldCheck
                                size={20}
                            />

                        )}

                    </div>


                    <div>

                        <span>
                            Current Approval
                        </span>


                        <strong
                            style={{
                                fontSize:
                                    "16px"
                            }}
                        >

                            {isSupervisor
                                ? "Supervisor"
                                : "Manager"}

                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                APPROVAL FLOW
            ================================================= */}

            <div
                style={{
                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    gap:
                        "12px",

                    margin:
                        "20px 0 25px",

                    flexWrap:
                        "wrap"
                }}
            >

                <div
                    style={{
                        padding:
                            "10px 16px",

                        borderRadius:
                            "10px",

                        background:
                            "#f8fafc",

                        border:
                            "1px solid #e2e8f0",

                        fontWeight:
                            "600"
                    }}
                >
                    Engineer
                </div>


                <span>
                    →
                </span>


                <div
                    style={{
                        padding:
                            "10px 16px",

                        borderRadius:
                            "10px",

                        background:
                            isSupervisor
                                ? "#eff6ff"
                                : "#f8fafc",

                        border:
                            "1px solid #bfdbfe",

                        color:
                            "#2563eb",

                        fontWeight:
                            "600"
                    }}
                >
                    Supervisor
                </div>


                <span>
                    →
                </span>


                <div
                    style={{
                        padding:
                            "10px 16px",

                        borderRadius:
                            "10px",

                        background:
                            isManager
                                ? "#f5f3ff"
                                : "#f8fafc",

                        border:
                            "1px solid #ddd6fe",

                        color:
                            "#7c3aed",

                        fontWeight:
                            "600"
                    }}
                >
                    Manager
                </div>


                <span>
                    →
                </span>


                <div
                    style={{
                        padding:
                            "10px 16px",

                        borderRadius:
                            "10px",

                        background:
                            "#f0fdf4",

                        border:
                            "1px solid #bbf7d0",

                        color:
                            "#16a34a",

                        fontWeight:
                            "600"
                    }}
                >
                    Approved
                </div>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div
                className="approval-content-card"
            >

                <div
                    className="approval-table-wrap"
                >

                    <table
                        className="approval-table"
                    >

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


                            {/* LOADING */}

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


                                /* EMPTY */

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="approval-table-message"
                                    >

                                        <div
                                            className="approval-empty"
                                        >

                                            <CheckCircle
                                                size={32}
                                            />


                                            <strong>
                                                Tidak ada request
                                            </strong>


                                            <span>

                                                {isSupervisor
                                                    ? "Tidak ada maintenance request yang menunggu approval Supervisor."
                                                    : "Tidak ada maintenance request yang menunggu approval Manager."}

                                            </span>

                                        </div>

                                    </td>

                                </tr>

                            ) : (


                                /* DATA */

                                requests.map(
                                    (item) => (

                                        <tr
                                            key={
                                                item.id
                                            }
                                        >


                                            {/* ID */}

                                            <td>

                                                <strong>
                                                    #{item.id}
                                                </strong>

                                            </td>


                                            {/* EQUIPMENT */}

                                            <td>

                                                <div
                                                    className="approval-equipment"
                                                >

                                                    <div
                                                        className="approval-equipment-icon"
                                                    >

                                                        <Wrench
                                                            size={14}
                                                        />

                                                    </div>


                                                    <div>

                                                        <strong>
                                                            Equipment #
                                                            {
                                                                item.equipment_id
                                                            }
                                                        </strong>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* ENGINEER */}

                                            <td>

                                                Engineer #

                                                {
                                                    item.engineer_id
                                                }

                                            </td>


                                            {/* DESCRIPTION */}

                                            <td>

                                                {
                                                    item.description ||
                                                    "-"
                                                }

                                            </td>


                                            {/* PRIORITY */}

                                            <td>

                                                <span
                                                    className={
                                                        `approval-priority ${
                                                            String(
                                                                item.priority ||
                                                                ""
                                                            ).toLowerCase()
                                                        }`
                                                    }
                                                >

                                                    {
                                                        item.priority ||
                                                        "-"
                                                    }

                                                </span>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={
                                                        `approval-status waiting`
                                                    }
                                                >

                                                    <Clock
                                                        size={13}
                                                    />


                                                    {
                                                        item.status
                                                    }

                                                </span>

                                            </td>


                                            {/* DATE */}

                                            <td>

                                                {
                                                    formatDate(
                                                        item.created_at
                                                    )
                                                }

                                            </td>


                                            {/* ACTION */}

                                            <td>

                                                <div
                                                    className="approval-actions"
                                                >


                                                    {/* SUPERVISOR */}

                                                    {isSupervisor && (

                                                        <button

                                                            type="button"

                                                            className="approve-btn"

                                                            disabled={
                                                                processingId ===
                                                                item.id
                                                            }

                                                            onClick={() =>
                                                                handleSupervisorApprove(
                                                                    item.id
                                                                )
                                                            }
                                                        >

                                                            <CheckCircle
                                                                size={15}
                                                            />

                                                            {processingId ===
                                                            item.id
                                                                ? "Processing..."
                                                                : "Approve"}

                                                        </button>

                                                    )}


                                                    {/* MANAGER */}

                                                    {isManager && (

                                                        <button

                                                            type="button"

                                                            className="approve-btn"

                                                            disabled={
                                                                processingId ===
                                                                item.id
                                                            }

                                                            onClick={() =>
                                                                handleManagerApprove(
                                                                    item.id
                                                                )
                                                            }
                                                        >

                                                            <CheckCircle
                                                                size={15}
                                                            />

                                                            {processingId ===
                                                            item.id
                                                                ? "Processing..."
                                                                : "Approve"}

                                                        </button>

                                                    )}


                                                    {/* REJECT */}

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
import { useEffect, useState } from "react";

import {
    CheckCircle,
    XCircle,
    Clock,
    Wrench,
    UserCheck,
    ShieldCheck,
    AlertCircle,
    RefreshCw
} from "lucide-react";


// ======================================================
// API BACKEND
// ======================================================

const API = "http://localhost:3000";


// ======================================================
// APPROVAL PAGE
// ======================================================

function Approval() {

    // ==================================================
    // USER LOGIN
    // ==================================================

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


    // ==================================================
    // ROLE
    // ==================================================

    const role =
        String(user?.role || "")
            .toLowerCase()
            .trim();


    const isSupervisor =
        role === "supervisor";


    const isManager =
        role === "manager";


    // ==================================================
    // STATE
    // ==================================================

    const [
        requests,
        setRequests
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        refreshing,
        setRefreshing
    ] = useState(false);


    const [
        processingId,
        setProcessingId
    ] = useState(null);


    const [
        notification,
        setNotification
    ] = useState(null);


    // ==================================================
    // NOTIFICATION
    // ==================================================

    const showNotification = (
        message,
        type = "success"
    ) => {

        setNotification({
            message,
            type
        });


        setTimeout(() => {

            setNotification(null);

        }, 5000);

    };


    // ==================================================
    // STATUS YANG DITUNGGU
    // ==================================================

    const waitingStatus =
        isSupervisor
            ? "PENDING_SUPERVISOR"
            : isManager
                ? "WAITING_MANAGER_APPROVAL"
                : null;


    // ==================================================
    // LOAD MAINTENANCE
    // ==================================================

    const loadRequests = async (
        showLoading = true
    ) => {

        try {

            if (showLoading) {

                setLoading(true);

            } else {

                setRefreshing(true);

            }


            const response =
                await fetch(
                    `${API}/api/maintenance`
                );


            // ==========================================
            // CEK HTTP
            // ==========================================

            if (!response.ok) {

                let errorData = null;

                try {

                    errorData =
                        await response.json();

                } catch {

                    // response bukan JSON

                }


                throw new Error(
                    errorData?.error ||
                    errorData?.message ||
                    `Server error ${response.status}`
                );

            }


            const data =
                await response.json();


            // ==========================================
            // PASTIKAN ARRAY
            // ==========================================

            if (!Array.isArray(data)) {

                throw new Error(
                    "Data maintenance dari server bukan array."
                );

            }


            // ==========================================
            // FILTER SESUAI ROLE
            // ==========================================

            const filtered =
                data.filter(
                    (item) => {

                        const status =
                            String(
                                item.status || ""
                            )
                                .trim()
                                .toUpperCase();


                        return (
                            status ===
                            waitingStatus
                        );

                    }
                );


            setRequests(
                filtered
            );


        } catch (error) {

            console.error(
                "LOAD APPROVAL ERROR:",
                error
            );


            showNotification(
                error.message ||
                "Gagal mengambil data maintenance.",
                "error"
            );


            setRequests([]);


        } finally {

            setLoading(false);

            setRefreshing(false);

        }

    };


    // ==================================================
    // LOAD PERTAMA
    // ==================================================

    useEffect(() => {

        if (
            isSupervisor ||
            isManager
        ) {

            loadRequests();

        } else {

            setLoading(false);

        }

    }, [role]);


    // ==================================================
    // UPDATE STATUS
    // ==================================================

    const updateStatus = async (
        id,
        newStatus
    ) => {

        try {

            setProcessingId(id);


            console.log(
                "================================"
            );

            console.log(
                "APPROVAL UPDATE"
            );

            console.log(
                "Maintenance ID:",
                id
            );

            console.log(
                "Role:",
                role
            );

            console.log(
                "Status baru:",
                newStatus
            );

            console.log(
                "================================"
            );


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
                                status:
                                    newStatus
                            })
                    }
                );


            // ==========================================
            // BACA RESPONSE
            // ==========================================

            let result = null;

            try {

                result =
                    await response.json();

            } catch {

                result = null;

            }


            console.log(
                "Backend response:",
                result
            );


            // ==========================================
            // ERROR DARI BACKEND
            // ==========================================

            if (!response.ok) {

                const backendError =
                    result?.error ||
                    result?.message ||
                    `Request gagal dengan status ${response.status}`;


                throw new Error(
                    backendError
                );

            }


            // ==========================================
            // BERHASIL
            // ==========================================

            if (
                !result?.success &&
                result?.success !== undefined
            ) {

                throw new Error(
                    result?.error ||
                    result?.message ||
                    "Backend gagal mengubah status."
                );

            }


            // ==========================================
            // SUPERVISOR
            // ==========================================

            if (
                isSupervisor &&
                newStatus ===
                    "WAITING_MANAGER_APPROVAL"
            ) {

                showNotification(
                    `Maintenance #${id} berhasil disetujui Supervisor dan diteruskan ke Manager.`,
                    "success"
                );

            }


            // ==========================================
            // MANAGER
            // ==========================================

            else if (
                isManager &&
                newStatus ===
                    "APPROVED"
            ) {

                showNotification(
                    `Maintenance #${id} berhasil disetujui Manager.`,
                    "success"
                );

            }


            // ==========================================
            // REJECT
            // ==========================================

            else if (
                newStatus ===
                "REJECTED"
            ) {

                showNotification(
                    `Maintenance #${id} berhasil ditolak.`,
                    "success"
                );

            }


            // ==========================================
            // REFRESH
            // ==========================================

            await loadRequests(false);


        } catch (error) {

            console.error(
                "UPDATE APPROVAL ERROR:",
                error
            );


            // ==========================================
            // TAMPILKAN ERROR ASLI
            // ==========================================

            showNotification(
                error.message ||
                "Gagal mengubah status maintenance.",
                "error"
            );


        } finally {

            setProcessingId(
                null
            );

        }

    };


    // ==================================================
    // SUPERVISOR APPROVE
    // ==================================================

    const handleSupervisorApprove = (
        item
    ) => {

        if (
            !item ||
            !item.id
        ) {

            showNotification(
                "ID maintenance tidak ditemukan.",
                "error"
            );

            return;

        }


        const confirmed =
            window.confirm(
                `Approve maintenance #${item.id}?\n\nRequest akan diteruskan ke Manager.`
            );


        if (!confirmed) {

            return;

        }


        // ==========================================
        // PENTING
        //
        // Supervisor:
        //
        // PENDING_SUPERVISOR
        //          ↓
        // WAITING_MANAGER_APPROVAL
        // ==========================================

        updateStatus(
            item.id,
            "WAITING_MANAGER_APPROVAL"
        );

    };


    // ==================================================
    // MANAGER APPROVE
    // ==================================================

    const handleManagerApprove = (
        item
    ) => {

        if (
            !item ||
            !item.id
        ) {

            showNotification(
                "ID maintenance tidak ditemukan.",
                "error"
            );

            return;

        }


        const confirmed =
            window.confirm(
                `Approve maintenance #${item.id}?\n\nRequest akan menjadi APPROVED.`
            );


        if (!confirmed) {

            return;

        }


        // ==========================================
        // PENTING
        //
        // Manager:
        //
        // WAITING_MANAGER_APPROVAL
        //          ↓
        // APPROVED
        // ==========================================

        updateStatus(
            item.id,
            "APPROVED"
        );

    };


    // ==================================================
    // REJECT
    // ==================================================

    const handleReject = (
        item
    ) => {

        if (
            !item ||
            !item.id
        ) {

            showNotification(
                "ID maintenance tidak ditemukan.",
                "error"
            );

            return;

        }


        const confirmed =
            window.confirm(
                `Tolak maintenance #${item.id}?\n\nRequest akan menjadi REJECTED.`
            );


        if (!confirmed) {

            return;

        }


        updateStatus(
            item.id,
            "REJECTED"
        );

    };


    // ==================================================
    // REFRESH BUTTON
    // ==================================================

    const handleRefresh = () => {

        loadRequests(false);

    };


    // ==================================================
    // FORMAT DATE
    // ==================================================

    const formatDate = (
        value
    ) => {

        if (!value) {

            return "-";

        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "-";

        }


        return date.toLocaleString(
            "id-ID",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // ==================================================
    // PRIORITY CLASS
    // ==================================================

    const getPriorityClass = (
        priority
    ) => {

        return String(
            priority || "MEDIUM"
        )
            .toLowerCase();

    };


    // ==================================================
    // STATUS CLASS
    // ==================================================

    const getStatusClass = (
        status
    ) => {

        const normalized =
            String(
                status || ""
            )
                .toLowerCase();


        if (
            normalized ===
            "pending_supervisor"
        ) {

            return "waiting";

        }


        if (
            normalized ===
            "waiting_manager_approval"
        ) {

            return "waiting";

        }


        if (
            normalized ===
            "approved"
        ) {

            return "approved";

        }


        if (
            normalized ===
            "rejected"
        ) {

            return "rejected";

        }


        return "";

    };


    // ==================================================
    // ROLE TIDAK VALID
    // ==================================================

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
                        padding: "60px",
                        textAlign: "center"
                    }}
                >

                    <ShieldCheck
                        size={50}
                    />


                    <h2>
                        Approval Tidak Tersedia
                    </h2>


                    <p>
                        Halaman ini hanya dapat
                        digunakan oleh Supervisor
                        dan Manager.
                    </p>

                </div>

            </div>

        );

    }


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <div
            className="approval-page"
        >

            {/* =========================================
                HEADER
            ========================================== */}

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

                        {isSupervisor
                            ? "Supervisor Approval"
                            : "Manager Approval"}

                    </h1>


                    <p>

                        {isSupervisor

                            ? "Review dan setujui maintenance request sebelum diteruskan ke manager."

                            : "Review maintenance request yang telah disetujui supervisor."
                        }

                    </p>

                </div>


                {/* ROLE */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "14px 24px",
                        borderRadius: "16px",
                        background:
                            isSupervisor
                                ? "#eff6ff"
                                : "#f5f3ff",
                        color:
                            isSupervisor
                                ? "#2563eb"
                                : "#7c3aed",
                        fontWeight: "700",
                        fontSize: "18px"
                    }}
                >

                    {isSupervisor ? (

                        <UserCheck
                            size={24}
                        />

                    ) : (

                        <ShieldCheck
                            size={24}
                        />

                    )}


                    {isSupervisor
                        ? "Supervisor"
                        : "Manager"}

                </div>

            </div>


            {/* =========================================
                NOTIFICATION
            ========================================== */}

            {notification && (

                <div
                    className={
                        notification.type === "error"
                            ? "approval-alert error"
                            : "approval-alert success"
                    }
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                    }}
                >

                    {notification.type === "error" ? (

                        <AlertCircle
                            size={22}
                        />

                    ) : (

                        <CheckCircle
                            size={22}
                        />

                    )}


                    <span>
                        {notification.message}
                    </span>

                </div>

            )}


            {/* =========================================
                SUMMARY
            ========================================== */}

            <div
                className="approval-summary"
            >

                {/* WAITING */}

                <div
                    className="approval-summary-card"
                >

                    <div
                        className="approval-summary-icon waiting"
                    >

                        <Clock
                            size={25}
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


                {/* CURRENT ROLE */}

                <div
                    className="approval-summary-card"
                >

                    <div
                        className="approval-summary-icon waiting"
                    >

                        {isSupervisor ? (

                            <UserCheck
                                size={25}
                            />

                        ) : (

                            <ShieldCheck
                                size={25}
                            />

                        )}

                    </div>


                    <div>

                        <span>
                            Current Approval
                        </span>


                        <strong
                            style={{
                                fontSize: "20px"
                            }}
                        >

                            {isSupervisor
                                ? "Supervisor"
                                : "Manager"}

                        </strong>

                    </div>

                </div>

            </div>


            {/* =========================================
                APPROVAL FLOW
            ========================================== */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "14px",
                    margin: "25px 0",
                    flexWrap: "wrap"
                }}
            >

                {/* ENGINEER */}

                <div
                    style={{
                        padding: "14px 24px",
                        borderRadius: "12px",
                        border:
                            "1px solid #dbe3ef",
                        background: "#ffffff",
                        fontWeight: "700",
                        fontSize: "18px"
                    }}
                >

                    Engineer

                </div>


                <span
                    style={{
                        fontSize: "24px"
                    }}
                >
                    →
                </span>


                {/* SUPERVISOR */}

                <div
                    style={{
                        padding: "14px 24px",
                        borderRadius: "12px",
                        border:
                            "1px solid #bfdbfe",
                        background: "#eff6ff",
                        color: "#2563eb",
                        fontWeight: "700",
                        fontSize: "18px"
                    }}
                >

                    Supervisor

                </div>


                <span
                    style={{
                        fontSize: "24px"
                    }}
                >
                    →
                </span>


                {/* MANAGER */}

                <div
                    style={{
                        padding: "14px 24px",
                        borderRadius: "12px",
                        border:
                            "1px solid #ddd6fe",
                        background: "#f5f3ff",
                        color: "#7c3aed",
                        fontWeight: "700",
                        fontSize: "18px"
                    }}
                >

                    Manager

                </div>


                <span
                    style={{
                        fontSize: "24px"
                    }}
                >
                    →
                </span>


                {/* APPROVED */}

                <div
                    style={{
                        padding: "14px 24px",
                        borderRadius: "12px",
                        border:
                            "1px solid #bbf7d0",
                        background: "#f0fdf4",
                        color: "#16a34a",
                        fontWeight: "700",
                        fontSize: "18px"
                    }}
                >

                    Approved

                </div>

            </div>


            {/* =========================================
                TABLE
            ========================================== */}

            <div
                className="approval-content-card"
            >

                {/* TABLE HEADER */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        padding: "15px 20px",
                        borderBottom:
                            "1px solid #e5e7eb"
                    }}
                >

                    <button
                        type="button"
                        onClick={
                            handleRefresh
                        }
                        disabled={
                            refreshing ||
                            loading
                        }
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            border: "none",
                            background: "#eff6ff",
                            color: "#2563eb",
                            padding:
                                "10px 16px",
                            borderRadius: "10px",
                            cursor:
                                "pointer",
                            fontWeight: "600"
                        }}
                    >

                        <RefreshCw
                            size={16}
                            style={{
                                animation:
                                    refreshing
                                        ? "spin 1s linear infinite"
                                        : "none"
                            }}
                        />

                        Refresh

                    </button>

                </div>


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

                            {/* =================================
                                LOADING
                            ================================== */}

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="approval-table-message"
                                    >

                                        <div
                                            className="approval-empty"
                                        >

                                            <Clock
                                                size={35}
                                            />

                                            <strong>
                                                Memuat data...
                                            </strong>

                                        </div>

                                    </td>

                                </tr>

                            ) : requests.length === 0 ? (

                                /* =================================
                                    EMPTY
                                ================================== */

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="approval-table-message"
                                    >

                                        <div
                                            className="approval-empty"
                                        >

                                            <CheckCircle
                                                size={40}
                                            />


                                            <strong>
                                                Tidak ada request
                                            </strong>


                                            <span>

                                                {isSupervisor

                                                    ? "Tidak ada maintenance request yang menunggu approval Supervisor."

                                                    : "Tidak ada maintenance request yang menunggu approval Manager."
                                                }

                                            </span>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                /* =================================
                                    DATA
                                ================================== */

                                requests.map(
                                    (item) => {

                                        const isProcessing =
                                            processingId ===
                                            item.id;


                                        return (

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
                                                        style={{
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            gap:
                                                                "12px"
                                                        }}
                                                    >

                                                        <div
                                                            style={{
                                                                width:
                                                                    "48px",
                                                                height:
                                                                    "48px",
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                                background:
                                                                    "#eff6ff",
                                                                borderRadius:
                                                                    "12px",
                                                                color:
                                                                    "#2563eb"
                                                            }}
                                                        >

                                                            <Wrench
                                                                size={22}
                                                            />

                                                        </div>


                                                        <strong>

                                                            Equipment #

                                                            {
                                                                item.equipment_id
                                                            }

                                                        </strong>

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
                                                            `approval-priority ${getPriorityClass(
                                                                item.priority
                                                            )}`
                                                        }
                                                    >

                                                        {
                                                            item.priority ||
                                                            "MEDIUM"
                                                        }

                                                    </span>

                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={
                                                            `approval-status ${getStatusClass(
                                                                item.status
                                                            )}`
                                                        }
                                                    >

                                                        <Clock
                                                            size={14}
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

                                                        {/* =================================
                                                            APPROVE SUPERVISOR
                                                        ================================== */}

                                                        {isSupervisor && (

                                                            <button
                                                                type="button"
                                                                className="approve-btn"
                                                                disabled={
                                                                    isProcessing
                                                                }
                                                                onClick={() =>
                                                                    handleSupervisorApprove(
                                                                        item
                                                                    )
                                                                }
                                                            >

                                                                <CheckCircle
                                                                    size={17}
                                                                />


                                                                {isProcessing
                                                                    ? "Processing..."
                                                                    : "Approve"}

                                                            </button>

                                                        )}


                                                        {/* =================================
                                                            APPROVE MANAGER
                                                        ================================== */}

                                                        {isManager && (

                                                            <button
                                                                type="button"
                                                                className="approve-btn"
                                                                disabled={
                                                                    isProcessing
                                                                }
                                                                onClick={() =>
                                                                    handleManagerApprove(
                                                                        item
                                                                    )
                                                                }
                                                            >

                                                                <CheckCircle
                                                                    size={17}
                                                                />


                                                                {isProcessing
                                                                    ? "Processing..."
                                                                    : "Approve"}

                                                            </button>

                                                        )}


                                                        {/* =================================
                                                            REJECT
                                                        ================================== */}

                                                        <button
                                                            type="button"
                                                            className="reject-btn"
                                                            disabled={
                                                                isProcessing
                                                            }
                                                            onClick={() =>
                                                                handleReject(
                                                                    item
                                                                )
                                                            }
                                                        >

                                                            <XCircle
                                                                size={17}
                                                            />

                                                            Reject

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =========================================
                INLINE STYLE UNTUK SPIN
            ========================================== */}

            <style>

                {`

                    @keyframes spin {

                        from {
                            transform: rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg);
                        }

                    }

                `}

            </style>

        </div>

    );

}


export default Approval;
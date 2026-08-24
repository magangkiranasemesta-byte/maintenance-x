import { useEffect, useState } from "react";

import {
    History as HistoryIcon,
    CheckCircle,
    XCircle,
    Clock,
    Wrench,
    Search,
    X,
    ArrowUp,
    ArrowDown
} from "lucide-react";


const API = "http://localhost:3000";


function History() {

    // =====================================================
    // STATE
    // =====================================================

    const [history, setHistory] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");


    // =====================================================
    // SORT STATE
    // =====================================================

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc"
    });


    // =====================================================
    // LOAD HISTORY
    // =====================================================

    const loadHistory = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await fetch(
                `${API}/api/maintenance/history`
            );


            const contentType =
                response.headers.get(
                    "content-type"
                ) || "";


            if (!contentType.includes("application/json")) {

                const text =
                    await response.text();


                console.error(
                    "Response bukan JSON:",
                    text
                );


                throw new Error(
                    `Server mengembalikan response bukan JSON (${response.status})`
                );

            }


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Gagal mengambil history"
                );

            }


            setHistory(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (err) {

            console.error(
                "Load history error:",
                err
            );


            setError(
                err.message
            );


            setHistory([]);


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadHistory();

    }, []);


    // =====================================================
    // STATUS ICON
    // =====================================================

    const getStatusIcon = (status) => {

        switch (status) {

            case "APPROVED":

                return (
                    <CheckCircle
                        size={18}
                    />
                );


            case "REJECTED":

                return (
                    <XCircle
                        size={18}
                    />
                );


            case "IN_PROGRESS":

                return (
                    <Wrench
                        size={18}
                    />
                );


            case "COMPLETED":

                return (
                    <CheckCircle
                        size={18}
                    />
                );


            default:

                return (
                    <Clock
                        size={18}
                    />
                );

        }

    };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {

        switch (status) {

            case "APPROVED":

                return "approved";


            case "REJECTED":

                return "rejected";


            case "IN_PROGRESS":

                return "progress";


            case "COMPLETED":

                return "approved";


            default:

                return "pending";

        }

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }


        return new Date(date).toLocaleString(
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


    // =====================================================
    // SEARCH FILTER
    // =====================================================

    const filteredHistory =
        history.filter((item) => {

            const keyword =
                search
                    .toLowerCase()
                    .trim();


            if (!keyword) {
                return true;
            }


            const searchableData = [

                item.maintenance_id,

                item.equipment_id,

                item.equipment_name,

                item.engineer_id,

                item.engineer_name,

                item.description,

                item.priority,

                item.status,

                formatDate(
                    item.created_at
                )

            ];


            return searchableData.some(
                (value) =>

                    String(
                        value || ""
                    )
                        .toLowerCase()
                        .includes(keyword)

            );

        });


    // =====================================================
    // SORT FUNCTION
    // =====================================================

    const getSortValue = (
        item,
        key
    ) => {

        switch (key) {

            case "maintenance_id":

                return String(
                    item.maintenance_id ||
                    ""
                );


            case "equipment_name":

                return String(
                    item.equipment_name ||
                    `Equipment #${item.equipment_id || ""}`
                );


            case "engineer_name":

                return String(
                    item.engineer_name ||
                    item.engineer_id ||
                    ""
                );


            case "description":

                return String(
                    item.description ||
                    ""
                );


            case "priority":

                return String(
                    item.priority ||
                    ""
                );


            case "status":

                return String(
                    item.status ||
                    ""
                );


            case "created_at":

                return item.created_at
                    ? new Date(
                        item.created_at
                    ).getTime()
                    : 0;


            default:

                return "";

        }

    };


    // =====================================================
    // SORTED HISTORY
    // =====================================================

    const sortedHistory =
        [...filteredHistory].sort(
            (a, b) => {

                if (!sortConfig.key) {
                    return 0;
                }


                const valueA =
                    getSortValue(
                        a,
                        sortConfig.key
                    );


                const valueB =
                    getSortValue(
                        b,
                        sortConfig.key
                    );


                // DATE / NUMBER

                if (
                    typeof valueA ===
                        "number" &&
                    typeof valueB ===
                        "number"
                ) {

                    return sortConfig.direction ===
                        "asc"

                        ? valueA - valueB

                        : valueB - valueA;

                }


                // TEXT

                const comparison =
                    String(valueA)
                        .toLowerCase()
                        .localeCompare(
                            String(valueB)
                                .toLowerCase(),
                            "id",
                            {
                                numeric: true,
                                sensitivity:
                                    "base"
                            }
                        );


                return sortConfig.direction ===
                    "asc"

                    ? comparison

                    : -comparison;

            }
        );


    // =====================================================
    // HANDLE SORT
    // =====================================================

    const handleSort = (key) => {

        setSortConfig(
            (previous) => {

                /*
                 * Jika klik kolom yang sama:
                 * ASC -> DESC
                 * DESC -> ASC
                 */

                if (
                    previous.key === key
                ) {

                    return {
                        key,
                        direction:
                            previous.direction ===
                            "asc"
                                ? "desc"
                                : "asc"
                    };

                }


                /*
                 * Jika klik kolom baru,
                 * mulai dari ASC
                 */

                return {
                    key,
                    direction: "asc"
                };

            }
        );

    };


    // =====================================================
    // SORT ICON
    // =====================================================

    const getSortIcon = (key) => {

        if (
            sortConfig.key !== key
        ) {

            return (
                <span className="history-sort-default">
                    <ArrowUp
                        size={13}
                    />

                    <ArrowDown
                        size={13}
                    />
                </span>
            );

        }


        if (
            sortConfig.direction ===
            "asc"
        ) {

            return (
                <ArrowUp
                    size={15}
                    className="history-sort-active"
                />
            );

        }


        return (
            <ArrowDown
                size={15}
                className="history-sort-active"
            />
        );

    };


    // =====================================================
    // SORTABLE HEADER
    // =====================================================

    const SortableHeader = ({
        label,
        sortKey
    }) => {

        return (

            <th>

                <button
                    type="button"
                    className={`history-sort-button ${
                        sortConfig.key ===
                        sortKey
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        handleSort(
                            sortKey
                        )
                    }
                >

                    <span>
                        {label}
                    </span>


                    {getSortIcon(
                        sortKey
                    )}

                </button>

            </th>

        );

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="history-page">


            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="history-page-header">

                <div>

                    <span className="page-label">
                        History
                    </span>


                    <h1>
                        History
                    </h1>


                    <p>
                        Riwayat seluruh aktivitas
                        maintenance equipment.
                    </p>

                </div>

            </div>


            {/* =====================================================
                CONTENT
            ===================================================== */}

            <div className="history-card">


                {/* =====================================================
                    CARD HEADER
                ===================================================== */}

                <div className="history-card-header">

                    <div>

                        <h3>
                            Maintenance History
                        </h3>


                        <p>
                            Riwayat request maintenance
                            yang telah diproses.
                        </p>

                    </div>


                    <div className="history-header-icon">

                        <HistoryIcon
                            size={22}
                        />

                    </div>

                </div>


                {/* =====================================================
                    SEARCH
                ===================================================== */}

                {!loading &&
                    !error &&
                    history.length > 0 && (

                        <div className="history-search-wrapper">

                            <div className="history-search">

                                <Search
                                    size={19}
                                    className="history-search-icon"
                                />


                                <input
                                    type="text"
                                    placeholder="Cari ID, equipment, engineer, status, priority..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                />


                                {search && (

                                    <button
                                        type="button"
                                        className="history-search-clear"
                                        onClick={() =>
                                            setSearch("")
                                        }
                                        title="Clear search"
                                    >

                                        <X
                                            size={17}
                                        />

                                    </button>

                                )}

                            </div>

                        </div>

                    )}


                {/* =====================================================
                    RESULT INFO
                ===================================================== */}

                {!loading &&
                    !error &&
                    history.length > 0 && (

                        <div className="history-result-info">

                            <span>

                                Menampilkan{" "}

                                <strong>
                                    {
                                        sortedHistory.length
                                    }
                                </strong>{" "}

                                dari{" "}

                                <strong>
                                    {
                                        history.length
                                    }
                                </strong>{" "}

                                data

                            </span>


                            {sortConfig.key && (

                                <span>

                                    Diurutkan:{" "}

                                    <strong>
                                        {sortConfig.direction ===
                                        "asc"
                                            ? "Ascending ↑"
                                            : "Descending ↓"}
                                    </strong>

                                </span>

                            )}

                        </div>

                    )}


                {/* =====================================================
                    ERROR
                ===================================================== */}

                {error && (

                    <div className="history-error">

                        {error}

                    </div>

                )}


                {/* =====================================================
                    LOADING
                ===================================================== */}

                {loading ? (

                    <div className="history-empty">

                        <Clock
                            size={24}
                        />


                        <h3>
                            Memuat history...
                        </h3>

                    </div>

                ) : history.length === 0 ? (

                    <div className="history-empty">

                        <HistoryIcon
                            size={28}
                        />


                        <h3>
                            Belum ada history
                        </h3>


                        <p>
                            Request maintenance
                            yang sudah diproses
                            akan muncul di sini.
                        </p>

                    </div>

                ) : sortedHistory.length === 0 ? (

                    /* =====================================================
                       SEARCH TIDAK DITEMUKAN
                    ===================================================== */

                    <div className="history-empty">

                        <Search
                            size={28}
                        />


                        <h3>
                            Data tidak ditemukan
                        </h3>


                        <p>
                            Tidak ada history
                            yang sesuai dengan
                            pencarian "{search}".
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                setSearch("")
                            }
                            className="history-reset-search"
                        >
                            Reset Pencarian
                        </button>

                    </div>

                ) : (

                    /* =====================================================
                        TABLE
                    ===================================================== */

                    <div className="history-table-wrapper">

                        <table className="history-table">

                            <thead>

                                <tr>

                                    {/* ID */}

                                    <SortableHeader
                                        label="ID"
                                        sortKey="maintenance_id"
                                    />


                                    {/* EQUIPMENT */}

                                    <SortableHeader
                                        label="EQUIPMENT"
                                        sortKey="equipment_name"
                                    />


                                    {/* ENGINEER */}

                                    <SortableHeader
                                        label="ENGINEER"
                                        sortKey="engineer_name"
                                    />


                                    {/* DESCRIPTION */}

                                    <SortableHeader
                                        label="DESCRIPTION"
                                        sortKey="description"
                                    />


                                    {/* PRIORITY */}

                                    <SortableHeader
                                        label="PRIORITY"
                                        sortKey="priority"
                                    />


                                    {/* STATUS */}

                                    <SortableHeader
                                        label="STATUS"
                                        sortKey="status"
                                    />


                                    {/* DATE */}

                                    <SortableHeader
                                        label="TANGGAL"
                                        sortKey="created_at"
                                    />

                                </tr>

                            </thead>


                            <tbody>

                                {sortedHistory.map(
                                    (item) => (

                                        <tr
                                            key={
                                                item.maintenance_id
                                            }
                                        >

                                            {/* =====================================================
                                                ID
                                            ===================================================== */}

                                            <td>

                                                {
                                                    item.maintenance_id
                                                }

                                            </td>


                                            {/* =====================================================
                                                EQUIPMENT
                                            ===================================================== */}

                                            <td>

                                                <div className="history-equipment">

                                                    <div className="history-equipment-icon">

                                                        <Wrench
                                                            size={15}
                                                        />

                                                    </div>


                                                    <span>

                                                        {
                                                            item.equipment_name ||
                                                            `Equipment #${item.equipment_id}`
                                                        }

                                                    </span>

                                                </div>

                                            </td>


                                            {/* =====================================================
                                                ENGINEER
                                            ===================================================== */}

                                            <td>

                                                {
                                                    item.engineer_name ||
                                                    item.engineer_id ||
                                                    "-"
                                                }

                                            </td>


                                            {/* =====================================================
                                                DESCRIPTION
                                            ===================================================== */}

                                            <td>

                                                {
                                                    item.description ||
                                                    "-"
                                                }

                                            </td>


                                            {/* =====================================================
                                                PRIORITY
                                            ===================================================== */}

                                            <td>

                                                {
                                                    item.priority ||
                                                    "-"
                                                }

                                            </td>


                                            {/* =====================================================
                                                STATUS
                                            ===================================================== */}

                                            <td>

                                                <span
                                                    className={`history-status ${getStatusClass(
                                                        item.status
                                                    )}`}
                                                >

                                                    {
                                                        getStatusIcon(
                                                            item.status
                                                        )
                                                    }


                                                    {
                                                        item.status ||
                                                        "-"
                                                    }

                                                </span>

                                            </td>


                                            {/* =====================================================
                                                DATE
                                            ===================================================== */}

                                            <td>

                                                {
                                                    formatDate(
                                                        item.created_at
                                                    )
                                                }

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}


export default History;
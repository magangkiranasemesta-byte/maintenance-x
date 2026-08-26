import React, { useEffect, useState } from "react";

import {
    Search,
    RefreshCw,
    ShieldCheck,
    ArrowUpDown
} from "lucide-react";


const API = "http://localhost:3000";


function AuditTrail() {

    // ======================================================
    // STATE
    // ======================================================

    const [auditLogs, setAuditLogs] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [sortConfig, setSortConfig] =
        useState({
            key: "created_at",
            direction: "desc"
        });


    // ======================================================
    // FETCH AUDIT LOG
    // ======================================================

    const fetchAuditLogs = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                `${API}/api/audit-trail`
            );


            if (!response.ok) {

                throw new Error(
                    `HTTP Error ${response.status}`
                );

            }


            const data =
                await response.json();


            const logs =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data.data)
                        ? data.data
                        : [];


            setAuditLogs(logs);


        } catch (error) {

            console.error(
                "Gagal mengambil audit trail:",
                error
            );

            setAuditLogs([]);

        } finally {

            setLoading(false);

        }

    };


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {

        fetchAuditLogs();

    }, []);


    // ======================================================
    // REALTIME POLLING
    // ======================================================

    useEffect(() => {

        const interval =
            setInterval(
                fetchAuditLogs,
                5000
            );


        return () => {

            clearInterval(interval);

        };

    }, []);


    // ======================================================
    // SORT
    // ======================================================

    const handleSort = (key) => {

        setSortConfig((current) => {

            if (current.key === key) {

                return {

                    key,

                    direction:
                        current.direction === "asc"
                            ? "desc"
                            : "asc"

                };

            }


            return {

                key,

                direction: "asc"

            };

        });

    };


    // ======================================================
    // FORMAT DATE
    // ======================================================

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
                minute: "2-digit",
                second: "2-digit"
            }
        );

    };


    // ======================================================
    // FORMAT JSON
    // ======================================================

    const formatData = (data) => {

        if (!data) {
            return "-";
        }


        try {

            const parsed =
                typeof data === "string"
                    ? JSON.parse(data)
                    : data;


            return JSON.stringify(
                parsed,
                null,
                2
            );

        } catch {

            return String(data);

        }

    };


    // ======================================================
    // FILTER
    // ======================================================

    const filteredLogs =
        auditLogs.filter((log) => {

            const keyword =
                search
                    .toLowerCase()
                    .trim();


            if (!keyword) {
                return true;
            }


            return [

                log.id,

                log.user_id,

                log.username,

                log.module,

                log.record_id,

                log.action,

                log.description,

                log.ip_address

            ]
                .filter(
                    value =>
                        value !== null &&
                        value !== undefined
                )
                .some(
                    value =>
                        String(value)
                            .toLowerCase()
                            .includes(keyword)
                );

        });


    // ======================================================
    // SORTED DATA
    // ======================================================

    const sortedLogs =
        [...filteredLogs].sort(
            (a, b) => {

                const key =
                    sortConfig.key;


                let valueA =
                    a[key];

                let valueB =
                    b[key];


                if (
                    key === "created_at"
                ) {

                    valueA =
                        new Date(valueA).getTime();

                    valueB =
                        new Date(valueB).getTime();

                }


                else {

                    valueA =
                        String(
                            valueA ?? ""
                        ).toLowerCase();

                    valueB =
                        String(
                            valueB ?? ""
                        ).toLowerCase();

                }


                if (valueA < valueB) {

                    return sortConfig.direction === "asc"
                        ? -1
                        : 1;

                }


                if (valueA > valueB) {

                    return sortConfig.direction === "asc"
                        ? 1
                        : -1;

                }


                return 0;

            }
        );


    // ======================================================
    // ACTION BADGE
    // ======================================================

    const getActionClass = (action) => {

        const value =
            String(
                action || ""
            ).toUpperCase();


        if (value === "CREATE") {
            return "audit-badge create";
        }


        if (value === "UPDATE") {
            return "audit-badge update";
        }


        if (value === "DELETE") {
            return "audit-badge delete";
        }


        if (value === "APPROVE") {
            return "audit-badge approve";
        }


        if (value === "REJECT") {
            return "audit-badge reject";
        }


        if (value === "STATUS_CHANGE") {
            return "audit-badge status";
        }


        return "audit-badge";

    };


    // ======================================================
    // SORT BUTTON
    // ======================================================

    const SortButton = ({
        label,
        column
    }) => {

        const active =
            sortConfig.key === column;


        return (

            <button
                type="button"
                onClick={() =>
                    handleSort(column)
                }
                style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontWeight: "600",
                    color: "#334155"
                }}
            >

                {label}

                <ArrowUpDown
                    size={14}
                    style={{
                        opacity:
                            active
                                ? 1
                                : 0.45
                    }}
                />

            </button>

        );

    };


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <div className="role-dashboard">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="dashboard-header">

                <div>

                    <p className="dashboard-label">
                        SECURITY & AUDIT
                    </p>

                    <h1>
                        Audit Trail
                    </h1>

                    <p className="dashboard-description">
                        Riwayat perubahan data dan aktivitas
                        penting dalam sistem.
                    </p>

                </div>


                <div className="dashboard-date">

                    <ShieldCheck
                        size={18}
                    />

                    <span>
                        System Audit
                    </span>

                </div>

            </div>


            {/* ==================================================
                CARD
            ================================================== */}

            <div className="dashboard-card">

                {/* HEADER */}

                <div className="card-header">

                    <div>

                        <h3>
                            Audit History
                        </h3>

                        <p>
                            Semua perubahan data yang tercatat
                            oleh sistem.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={fetchAuditLogs}
                        style={{
                            border: "1px solid #e2e8f0",
                            background: "#ffffff",
                            borderRadius: "8px",
                            padding: "9px 12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                            color: "#475569"
                        }}
                    >

                        <RefreshCw
                            size={16}
                        />

                        Refresh

                    </button>

                </div>


                {/* ==================================================
                    SEARCH
                ================================================== */}

                <div
                    style={{
                        marginTop: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        padding: "0 14px",
                        height: "42px",
                        background: "#ffffff"
                    }}
                >

                    <Search
                        size={18}
                        color="#64748b"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Cari audit log..."
                        style={{
                            width: "100%",
                            border: "none",
                            outline: "none",
                            fontSize: "14px"
                        }}
                    />

                </div>


                {/* ==================================================
                    INFO
                ================================================== */}

                <div
                    style={{
                        marginTop: "15px",
                        marginBottom: "15px",
                        fontSize: "13px",
                        color: "#64748b"
                    }}
                >

                    Menampilkan{" "}
                    <strong>
                        {sortedLogs.length}
                    </strong>{" "}
                    audit log

                </div>


                {/* ==================================================
                    TABLE
                ================================================== */}

                <div className="maintenance-table-wrapper">

                    <table className="maintenance-table">

                        <thead>

                            <tr>

                                <th>
                                    <SortButton
                                        label="ID"
                                        column="id"
                                    />
                                </th>

                                <th>
                                    <SortButton
                                        label="User"
                                        column="username"
                                    />
                                </th>

                                <th>
                                    <SortButton
                                        label="Module"
                                        column="module"
                                    />
                                </th>

                                <th>
                                    <SortButton
                                        label="Record ID"
                                        column="record_id"
                                    />
                                </th>

                                <th>
                                    <SortButton
                                        label="Action"
                                        column="action"
                                    />
                                </th>

                                <th>
                                    Description
                                </th>

                                <th>
                                    Old Data
                                </th>

                                <th>
                                    New Data
                                </th>

                                <th>
                                    IP Address
                                </th>

                                <th>
                                    <SortButton
                                        label="Tanggal"
                                        column="created_at"
                                    />
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="10"
                                        style={{
                                            textAlign: "center",
                                            padding: "40px"
                                        }}
                                    >
                                        Memuat audit log...
                                    </td>

                                </tr>

                            ) : sortedLogs.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="10"
                                        style={{
                                            textAlign: "center",
                                            padding: "40px",
                                            color: "#64748b"
                                        }}
                                    >
                                        Tidak ada audit log.

                                    </td>

                                </tr>

                            ) : (

                                sortedLogs.map(
                                    (log) => (

                                        <tr
                                            key={log.id}
                                        >

                                            <td>
                                                <strong>
                                                    #{log.id}
                                                </strong>
                                            </td>


                                            <td>
                                                {log.username ||
                                                    log.user_id ||
                                                    "-"
                                                }
                                            </td>


                                            <td>
                                                {log.module ||
                                                    "-"
                                                }
                                            </td>


                                            <td>
                                                {log.record_id ||
                                                    "-"
                                                }
                                            </td>


                                            <td>

                                                <span
                                                    className={getActionClass(
                                                        log.action
                                                    )}
                                                >
                                                    {log.action ||
                                                        "-"
                                                    }
                                                </span>

                                            </td>


                                            <td>
                                                {log.description ||
                                                    "-"
                                                }
                                            </td>


                                            <td>

                                                <pre
                                                    style={{
                                                        margin: 0,
                                                        maxWidth: "220px",
                                                        maxHeight: "100px",
                                                        overflow: "auto",
                                                        fontSize: "11px",
                                                        whiteSpace: "pre-wrap"
                                                    }}
                                                >
                                                    {formatData(
                                                        log.old_data
                                                    )}
                                                </pre>

                                            </td>


                                            <td>

                                                <pre
                                                    style={{
                                                        margin: 0,
                                                        maxWidth: "220px",
                                                        maxHeight: "100px",
                                                        overflow: "auto",
                                                        fontSize: "11px",
                                                        whiteSpace: "pre-wrap"
                                                    }}
                                                >
                                                    {formatData(
                                                        log.new_data
                                                    )}
                                                </pre>

                                            </td>


                                            <td>
                                                {log.ip_address ||
                                                    "-"
                                                }
                                            </td>


                                            <td>
                                                {formatDate(
                                                    log.created_at
                                                )}
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


export default AuditTrail;
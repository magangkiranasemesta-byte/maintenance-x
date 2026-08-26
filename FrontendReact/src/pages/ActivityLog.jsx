import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Activity,
    Search,
    ArrowUp,
    ArrowDown
} from "lucide-react";


const API = "http://localhost:3000";


const ActivityLog = () => {

    const [logs, setLogs] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [sortConfig, setSortConfig] =
        useState({
            key: "created_at",
            direction: "desc"
        });


    // ======================================================
    // FETCH
    // ======================================================

    const fetchLogs = async () => {

        try {

            const response =
                await fetch(
                    `${API}/api/activity-logs`
                );


            const result =
                await response.json();


            if (result.success) {

                setLogs(
                    result.data || []
                );

            }

        } catch (error) {

            console.error(
                "Activity log error:",
                error
            );

        }

    };


    useEffect(() => {

        fetchLogs();


        const interval =
            setInterval(
                fetchLogs,
                5000
            );


        return () =>
            clearInterval(interval);

    }, []);


    // ======================================================
    // SORT
    // ======================================================

    const handleSort = (key) => {

        setSortConfig(
            current => ({

                key,

                direction:
                    current.key === key &&
                    current.direction === "asc"
                        ? "desc"
                        : "asc"

            })
        );

    };


    // ======================================================
    // FILTER + SORT
    // ======================================================

    const filteredLogs = useMemo(() => {

        let result =
            [...logs];


        if (search.trim()) {

            const keyword =
                search.toLowerCase();


            result =
                result.filter(
                    item =>
                        String(
                            item.user_name
                        )
                            .toLowerCase()
                            .includes(keyword) ||

                        String(
                            item.action
                        )
                            .toLowerCase()
                            .includes(keyword) ||

                        String(
                            item.module
                        )
                            .toLowerCase()
                            .includes(keyword) ||

                        String(
                            item.description
                        )
                            .toLowerCase()
                            .includes(keyword)
                );

        }


        result.sort(
            (a, b) => {

                const valueA =
                    String(
                        a[
                            sortConfig.key
                        ] ?? ""
                    ).toLowerCase();


                const valueB =
                    String(
                        b[
                            sortConfig.key
                        ] ?? ""
                    ).toLowerCase();


                if (
                    valueA <
                    valueB
                ) {
                    return sortConfig.direction ===
                        "asc"
                        ? -1
                        : 1;
                }


                if (
                    valueA >
                    valueB
                ) {
                    return sortConfig.direction ===
                        "asc"
                        ? 1
                        : -1;
                }


                return 0;

            }
        );


        return result;

    }, [
        logs,
        search,
        sortConfig
    ]);


    // ======================================================
    // SORT ICON
    // ======================================================

    const SortIcon = ({
        column
    }) => {

        if (
            sortConfig.key !== column
        ) {
            return null;
        }


        return sortConfig.direction ===
            "asc"
            ? <ArrowUp size={14} />
            : <ArrowDown size={14} />;

    };


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <div className="role-dashboard">


            <div className="dashboard-header">

                <div>

                    <p className="dashboard-label">
                        SYSTEM MONITORING
                    </p>

                    <h1>
                        Activity Log
                    </h1>

                    <p className="dashboard-description">
                        Riwayat aktivitas pengguna dalam sistem.
                    </p>

                </div>


                <Activity size={24} />

            </div>


            {/* SEARCH */}

            <div
                className="dashboard-card"
                style={{
                    marginTop: "20px"
                }}
            >

                <div
                    style={{
                        position: "relative"
                    }}
                >

                    <Search
                        size={18}
                        style={{
                            position: "absolute",
                            left: "14px",
                            top: "50%",
                            transform:
                                "translateY(-50%)",
                            color: "#94a3b8"
                        }}
                    />


                    <input
                        type="text"
                        placeholder="Search activity..."
                        value={search}
                        onChange={e =>
                            setSearch(
                                e.target.value
                            )
                        }
                        style={{
                            width: "100%",
                            padding:
                                "12px 15px 12px 42px",
                            border:
                                "1px solid #e2e8f0",
                            borderRadius: "10px",
                            outline: "none"
                        }}
                    />

                </div>

            </div>


            {/* TABLE */}

            <div
                className="dashboard-card"
                style={{
                    marginTop: "20px"
                }}
            >

                <div className="maintenance-table-wrapper">

                    <table className="maintenance-table">

                        <thead>

                            <tr>

                                <th
                                    onClick={() =>
                                        handleSort("id")
                                    }
                                >
                                    ID{" "}
                                    <SortIcon column="id" />
                                </th>

                                <th
                                    onClick={() =>
                                        handleSort(
                                            "user_name"
                                        )
                                    }
                                >
                                    User{" "}
                                    <SortIcon
                                        column="user_name"
                                    />
                                </th>

                                <th
                                    onClick={() =>
                                        handleSort(
                                            "action"
                                        )
                                    }
                                >
                                    Action{" "}
                                    <SortIcon
                                        column="action"
                                    />
                                </th>

                                <th
                                    onClick={() =>
                                        handleSort(
                                            "module"
                                        )
                                    }
                                >
                                    Module{" "}
                                    <SortIcon
                                        column="module"
                                    />
                                </th>

                                <th>
                                    Description
                                </th>

                                <th
                                    onClick={() =>
                                        handleSort(
                                            "created_at"
                                        )
                                    }
                                >
                                    Date{" "}
                                    <SortIcon
                                        column="created_at"
                                    />
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredLogs.length ===
                                0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        style={{
                                            textAlign:
                                                "center",
                                            padding:
                                                "30px"
                                        }}
                                    >
                                        Tidak ada aktivitas.
                                    </td>

                                </tr>

                            ) : (

                                filteredLogs.map(
                                    log => (

                                        <tr
                                            key={
                                                log.id
                                            }
                                        >

                                            <td>
                                                {log.id}
                                            </td>

                                            <td>
                                                {log.user_name}
                                            </td>

                                            <td>
                                                <strong>
                                                    {log.action}
                                                </strong>
                                            </td>

                                            <td>
                                                {log.module}
                                            </td>

                                            <td>
                                                {log.description}
                                            </td>

                                            <td>
                                                {new Date(
                                                    log.created_at
                                                ).toLocaleString(
                                                    "id-ID"
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

};


export default ActivityLog;
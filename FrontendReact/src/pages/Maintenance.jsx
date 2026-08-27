import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    X,
    Wrench,
    Search,
    ArrowUpDown,
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

const API = "http://localhost:3000";

function Maintenance() {
    const [requests, setRequests] = useState([]);
    const [equipment, setEquipment] = useState([]);

    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    // =====================================================
    // SEARCH REALTIME
    // =====================================================

    const [search, setSearch] = useState("");

    // =====================================================
    // PAGINATION
    // =====================================================

    const [currentPage, setCurrentPage] = useState(1);

    // Jumlah data per halaman
    const itemsPerPage = 10;

    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({
        equipment_id: "",
        engineer_id: "",
        priority: "MEDIUM",
        description: ""
    });

    // =====================================================
    // SORTING
    // =====================================================

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc"
    });

    // =====================================================
    // GET USER LOGIN
    // =====================================================

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const userRole = String(
        user?.role || ""
    )
        .trim()
        .toLowerCase();

    console.log("USER LOGIN:", user);
    console.log("ROLE LOGIN:", user?.role);
    console.log("ROLE NORMALIZED:", userRole);

    // =====================================================
    // ALERT
    // =====================================================

    const showAlert = (text, type) => {
        setMessage(text);
        setMessageType(type);

        setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 3500);
    };

    // =====================================================
    // LOAD EQUIPMENT
    // =====================================================

    const loadEquipment = async () => {
        try {
            const response = await fetch(
                `${API}/api/equipment`
            );

            if (!response.ok) {
                throw new Error(
                    "Gagal mengambil equipment"
                );
            }

            const data = await response.json();

            setEquipment(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (error) {
            console.error(
                "Load equipment error:",
                error
            );

            showAlert(
                error.message,
                "error"
            );
        }
    };

    // =====================================================
    // LOAD MAINTENANCE
    // =====================================================

    const loadRequests = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${API}/api/maintenance`
            );

            if (!response.ok) {
                throw new Error(
                    "Gagal mengambil maintenance request"
                );
            }

            const data = await response.json();

            setRequests(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (error) {
            console.error(
                "Load maintenance error:",
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
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        loadRequests();

        if (userRole === "engineer") {
            loadEquipment();
        }
    }, [userRole]);

    // =====================================================
    // HANDLE FORM
    // =====================================================

    const handleChange = (e) => {
        const {
            name,
            value
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =====================================================
    // OPEN MODAL
    // =====================================================

    const openModal = () => {
        if (userRole !== "engineer") {
            return;
        }

        setModalOpen(true);

        loadEquipment();
    };

    // =====================================================
    // SUBMIT REQUEST
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (userRole !== "engineer") {
            showAlert(
                "Anda tidak memiliki akses untuk membuat maintenance request.",
                "error"
            );

            return;
        }

        if (!formData.equipment_id) {
            showAlert(
                "Equipment wajib dipilih.",
                "error"
            );

            return;
        }

        if (!formData.engineer_id) {
            showAlert(
                "Engineer ID wajib diisi.",
                "error"
            );

            return;
        }

        if (!formData.description.trim()) {
            showAlert(
                "Description wajib diisi.",
                "error"
            );

            return;
        }

        try {
            const body = {
                equipment_id: Number(
                    formData.equipment_id
                ),

                engineer_id: Number(
                    formData.engineer_id
                ),

                description:
                    formData.description.trim(),

                priority:
                    formData.priority
            };

            const response = await fetch(
                `${API}/api/maintenance`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(body)
                }
            );

            const contentType =
                response.headers.get(
                    "content-type"
                ) || "";

            let result;

            if (
                contentType.includes(
                    "application/json"
                )
            ) {
                result =
                    await response.json();
            } else {
                const text =
                    await response.text();

                throw new Error(
                    text ||
                        `Server mengembalikan response bukan JSON (${response.status})`
                );
            }

            if (!response.ok) {
                throw new Error(
                    result?.message ||
                        result?.error ||
                        "Gagal membuat request"
                );
            }

            showAlert(
                `Maintenance request berhasil ditambahkan. ID: ${
                    result?.id || "-"
                }`,
                "success"
            );

            setFormData({
                equipment_id: "",
                engineer_id: "",
                priority: "MEDIUM",
                description: ""
            });

            setModalOpen(false);

            // Kembali ke halaman pertama
            setCurrentPage(1);

            await loadRequests();
        } catch (error) {
            console.error(
                "Create maintenance error:",
                error
            );

            showAlert(
                error.message ||
                    "Gagal membuat maintenance request.",
                "error"
            );
        }
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "-";
        }

        return parsedDate.toLocaleDateString(
            "id-ID"
        );
    };

    // =====================================================
    // HANDLE SORT
    // =====================================================

    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return {
                    key,
                    direction:
                        prev.direction === "asc"
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

    // =====================================================
    // GET SORT VALUE
    // =====================================================

    const getSortValue = (
        item,
        key
    ) => {
        switch (key) {
            case "id":
                return Number(
                    item.id
                ) || 0;

            case "equipment":
                return String(
                    item.equipment_name ||
                        item.equipment ||
                        `Equipment #${
                            item.equipment_id || ""
                        }`
                ).toLowerCase();

            case "engineer":
                return Number(
                    item.engineer_id
                ) || 0;

            case "description":
                return String(
                    item.description || ""
                ).toLowerCase();

            case "priority":
                return String(
                    item.priority || ""
                ).toLowerCase();

            case "status":
                return String(
                    item.status || ""
                ).toLowerCase();

            case "date":
                return (
                    new Date(
                        item.created_at
                    ).getTime()
                ) || 0;

            default:
                return "";
        }
    };

    // =====================================================
    // REALTIME SEARCH + SORTING
    // =====================================================

    const filteredAndSortedRequests =
        useMemo(() => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            let result = [
                ...requests
            ];

            // =================================================
            // REALTIME SEARCH
            // =================================================

            if (keyword !== "") {
                result =
                    result.filter(
                        (item) => {
                            const searchableValues = [
                                item.id,

                                item.equipment_id,

                                item.equipment_code,

                                item.equipment_name,

                                item.equipment,

                                item.engineer_id,

                                item.engineer_name,

                                item.engineer,

                                item.description,

                                item.priority,

                                item.status,

                                item.created_at
                            ];

                            const searchableText =
                                searchableValues
                                    .map(
                                        (
                                            value
                                        ) =>
                                            String(
                                                value ??
                                                    ""
                                            ).toLowerCase()
                                    )
                                    .join(
                                        " "
                                    );

                            return searchableText.includes(
                                keyword
                            );
                        }
                    );
            }

            // =================================================
            // SORTING
            // =================================================

            if (sortConfig.key) {
                result.sort(
                    (a, b) => {
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
            }

            return result;
        }, [
            requests,
            search,
            sortConfig
        ]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalItems =
        filteredAndSortedRequests.length;

    const totalPages =
        Math.ceil(
            totalItems /
                itemsPerPage
        );

    const paginatedRequests =
        useMemo(() => {
            const startIndex =
                (currentPage - 1) *
                itemsPerPage;

            const endIndex =
                startIndex +
                itemsPerPage;

            return filteredAndSortedRequests.slice(
                startIndex,
                endIndex
            );
        }, [
            filteredAndSortedRequests,
            currentPage
        ]);

    // =====================================================
    // RESET PAGE WHEN SEARCH / SORT CHANGES
    // =====================================================

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        sortConfig
    ]);

    // =====================================================
    // PREVENT INVALID CURRENT PAGE
    // =====================================================

    useEffect(() => {
        if (
            totalPages > 0 &&
            currentPage > totalPages
        ) {
            setCurrentPage(
                totalPages
            );
        }
    }, [
        currentPage,
        totalPages
    ]);

    // =====================================================
    // SORT HEADER COMPONENT
    // =====================================================

    const SortableHeader = ({
        label,
        sortKey
    }) => {
        const active =
            sortConfig.key ===
            sortKey;

        return (
            <button
                type="button"
                className={`maintenance-sort-button ${
                    active
                        ? "active"
                        : ""
                }`}
                onClick={() =>
                    handleSort(sortKey)
                }
                title={
                    active
                        ? sortConfig.direction ===
                          "asc"
                            ? "Klik untuk Descending"
                            : "Klik untuk Ascending"
                        : "Klik untuk Ascending"
                }
            >
                <span>
                    {label}
                </span>

                {!active && (
                    <ArrowUpDown
                        size={14}
                    />
                )}

                {active &&
                    sortConfig.direction ===
                        "asc" && (
                        <ChevronUp
                            size={15}
                        />
                    )}

                {active &&
                    sortConfig.direction ===
                        "desc" && (
                        <ChevronDown
                            size={15}
                        />
                    )}
            </button>
        );
    };

    // =====================================================
    // RESET SORT
    // =====================================================

    const resetSort = () => {
        setSortConfig({
            key: null,
            direction: "asc"
        });
    };

    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const clearSearch = () => {
        setSearch("");
        setCurrentPage(1);
    };

    // =====================================================
    // PAGINATION HANDLER
    // =====================================================

    const goToPage = (page) => {
        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        setCurrentPage(page);

        // Scroll ke atas table
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =====================================================
    // RETURN
    // =====================================================

    return (
        <div className="maintenance-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="maintenance-page-header">

                <div>

                    <span className="page-label">
                        Maintenance
                    </span>

                    <h1>
                        Maintenance Request
                    </h1>

                    <p>
                        Kelola permintaan maintenance equipment.
                    </p>

                </div>

                {userRole ===
                    "engineer" && (

                    <button
                        className="primary-btn"
                        onClick={
                            openModal
                        }
                    >
                        <Plus
                            size={16}
                        />

                        Request Maintenance
                    </button>
                )}

            </header>

            {/* =================================================
                ALERT
            ================================================= */}

            {message && (

                <div
                    className={`maintenance-alert ${messageType}`}
                >
                    {message}
                </div>

            )}

            {/* =================================================
                SEARCH
            ================================================= */}

            <section className="maintenance-content-card maintenance-search-card">

                <div className="maintenance-search-wrapper">

                    <Search
                        size={18}
                        className="maintenance-search-icon"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search maintenance..."
                        className="maintenance-search-input"
                    />

                    {search && (

                        <button
                            type="button"
                            className="maintenance-search-clear"
                            onClick={
                                clearSearch
                            }
                            title="Clear search"
                        >
                            <X
                                size={16}
                            />
                        </button>

                    )}

                </div>

                <div className="maintenance-search-info">

                    <span>
                        {search
                            ? `Menampilkan hasil pencarian untuk "${search}"`
                            : "Search realtime aktif — ketik 1 karakter untuk memfilter."}
                    </span>

                    <span>
                        Menampilkan{" "}
                        <strong>
                            {
                                filteredAndSortedRequests.length
                            }
                        </strong>{" "}
                        dari{" "}
                        <strong>
                            {
                                requests.length
                            }
                        </strong>{" "}
                        data
                    </span>

                </div>

            </section>

            {/* =================================================
                TABLE
            ================================================= */}

            <section className="maintenance-content-card">

                <div className="maintenance-table-wrap">

                    <table className="maintenance-table">

                        <thead>

                            <tr>

                                <th>
                                    <SortableHeader
                                        label="ID"
                                        sortKey="id"
                                    />
                                </th>

                                <th>
                                    <SortableHeader
                                        label="EQUIPMENT"
                                        sortKey="equipment"
                                    />
                                </th>

                                <th>
                                    <SortableHeader
                                        label="ENGINEER"
                                        sortKey="engineer"
                                    />
                                </th>

                                <th>
                                    <SortableHeader
                                        label="DESKRIPSI"
                                        sortKey="description"
                                    />
                                </th>

                                <th>
                                    <SortableHeader
                                        label="PRIORITY"
                                        sortKey="priority"
                                    />
                                </th>

                                <th>
                                    <SortableHeader
                                        label="STATUS"
                                        sortKey="status"
                                    />
                                </th>

                                <th>
                                    <SortableHeader
                                        label="TANGGAL"
                                        sortKey="date"
                                    />
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="maintenance-table-message"
                                    >
                                        Memuat data...
                                    </td>

                                </tr>

                            ) : requests.length ===
                              0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="maintenance-table-message"
                                    >
                                        Belum ada maintenance request.
                                    </td>

                                </tr>

                            ) : filteredAndSortedRequests.length ===
                              0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="maintenance-table-message"
                                    >
                                        Tidak ada data yang cocok dengan pencarian "{search}".
                                    </td>

                                </tr>

                            ) : (

                                paginatedRequests.map(
                                    (item) => (

                                        <tr
                                            key={
                                                item.id
                                            }
                                        >

                                            {/* ID */}

                                            <td>
                                                {
                                                    item.id
                                                }
                                            </td>

                                            {/* EQUIPMENT */}

                                            <td>

                                                <div className="maintenance-equipment">

                                                    <div className="maintenance-equipment-icon">

                                                        <Wrench
                                                            size={
                                                                13
                                                            }
                                                        />

                                                    </div>

                                                    <span>
                                                        {item.equipment_name ||
                                                        item.equipment
                                                            ? item.equipment_name ||
                                                              item.equipment
                                                            : `Equipment #${
                                                                  item.equipment_id ||
                                                                  "-"
                                                              }`}
                                                    </span>

                                                </div>

                                                {item.equipment_code && (
                                                    <small>
                                                        {
                                                            item.equipment_code
                                                        }
                                                    </small>
                                                )}

                                            </td>

                                            {/* ENGINEER */}

                                            <td>
                                                {
                                                    item.engineer_name ||
                                                    item.engineer ||
                                                    item.engineer_id ||
                                                    "-"
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
                                                    className={`maintenance-priority ${String(
                                                        item.priority ||
                                                            ""
                                                    ).toLowerCase()}`}
                                                >
                                                    {
                                                        item.priority ||
                                                        "-"
                                                    }
                                                </span>

                                            </td>

                                            {/* STATUS */}

                                            <td>

                                                <span className="maintenance-status">

                                                    {
                                                        item.status ||
                                                        "-"
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

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

                {/* =================================================
                    FOOTER
                ================================================= */}

                {!loading &&
                    requests.length >
                        0 && (

                    <>

                        {/* SORTING FOOTER */}

                        <div className="maintenance-sort-footer">

                            <div className="maintenance-footer-info">

                                <span>

                                    {sortConfig.key ? (
                                        <>
                                            Sorting:{" "}
                                            <strong>
                                                {
                                                    sortConfig.key
                                                }
                                            </strong>{" "}
                                            (
                                            {sortConfig.direction ===
                                            "asc"
                                                ? "Ascending ↑"
                                                : "Descending ↓"}
                                            )
                                        </>
                                    ) : (
                                        "Sorting belum dipilih"
                                    )}

                                </span>

                                <span>

                                    Menampilkan{" "}

                                    <strong>
                                        {totalItems ===
                                        0
                                            ? 0
                                            : (currentPage -
                                                  1) *
                                                  itemsPerPage +
                                              1}
                                    </strong>

                                    {" - "}

                                    <strong>
                                        {Math.min(
                                            currentPage *
                                                itemsPerPage,
                                            totalItems
                                        )}
                                    </strong>

                                    {" dari "}

                                    <strong>
                                        {
                                            totalItems
                                        }
                                    </strong>

                                    {" data"}

                                </span>

                            </div>

                            <div
                                style={{
                                    display:
                                        "flex",
                                    gap: "8px",
                                    alignItems:
                                        "center"
                                }}
                            >

                                {sortConfig.key && (

                                    <button
                                        type="button"
                                        onClick={
                                            resetSort
                                        }
                                        className="maintenance-reset-sort"
                                    >
                                        Reset Sorting
                                    </button>

                                )}

                                {search && (

                                    <button
                                        type="button"
                                        onClick={
                                            clearSearch
                                        }
                                        className="maintenance-reset-sort"
                                    >
                                        Reset Search
                                    </button>

                                )}

                            </div>

                        </div>

                        {/* PAGINATION */}

                        {totalPages > 1 && (

                            <div className="maintenance-pagination">

                                {/* PREVIOUS */}

                                <button
                                    type="button"
                                    className="maintenance-pagination-btn"
                                    disabled={
                                        currentPage ===
                                        1
                                    }
                                    onClick={() =>
                                        goToPage(
                                            currentPage -
                                                1
                                        )
                                    }
                                >

                                    <ChevronLeft
                                        size={16}
                                    />

                                    Previous

                                </button>

                                {/* PAGE NUMBERS */}

                                <div className="maintenance-page-numbers">

                                    {Array.from(
                                        {
                                            length: totalPages
                                        },
                                        (
                                            _,
                                            index
                                        ) => {
                                            const page =
                                                index +
                                                1;

                                            return (
                                                <button
                                                    key={
                                                        page
                                                    }
                                                    type="button"
                                                    className={`maintenance-page-number ${
                                                        currentPage ===
                                                        page
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        goToPage(
                                                            page
                                                        )
                                                    }
                                                >
                                                    {
                                                        page
                                                    }
                                                </button>
                                            );
                                        }
                                    )}

                                </div>

                                {/* NEXT */}

                                <button
                                    type="button"
                                    className="maintenance-pagination-btn"
                                    disabled={
                                        currentPage ===
                                            totalPages ||
                                        totalPages ===
                                            0
                                    }
                                    onClick={() =>
                                        goToPage(
                                            currentPage +
                                                1
                                        )
                                    }
                                >

                                    Next

                                    <ChevronRight
                                        size={16}
                                    />

                                </button>

                            </div>

                        )}

                    </>

                )}

            </section>

            {/* =================================================
                MODAL
            ================================================= */}

            {modalOpen &&
                userRole ===
                    "engineer" && (

                <div
                    className="maintenance-modal"

                    onClick={(e) => {
                        if (
                            e.target.className ===
                            "maintenance-modal"
                        ) {
                            setModalOpen(
                                false
                            );
                        }
                    }}
                >

                    <div className="maintenance-modal-box">

                        {/* MODAL HEADER */}

                        <div className="maintenance-modal-header">

                            <div>

                                <h2>
                                    Request Maintenance
                                </h2>

                                <p>
                                    Buat permintaan maintenance baru.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="maintenance-close"
                                onClick={() =>
                                    setModalOpen(
                                        false
                                    )
                                }
                            >
                                <X
                                    size={20}
                                />
                            </button>

                        </div>

                        {/* FORM */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="maintenance-form"
                        >

                            {/* EQUIPMENT */}

                            <div className="maintenance-field">

                                <label>
                                    Equipment
                                </label>

                                <select
                                    name="equipment_id"
                                    value={
                                        formData.equipment_id
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="">
                                        -- Pilih Equipment --
                                    </option>

                                    {equipment.map(
                                        (item) => (

                                            <option
                                                key={
                                                    item.id
                                                }
                                                value={
                                                    item.id
                                                }
                                            >

                                                {
                                                    item.equipment_code
                                                }

                                                {" - "}

                                                {
                                                    item.name
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* ENGINEER */}

                            <div className="maintenance-field">

                                <label>
                                    Engineer ID
                                </label>

                                <input
                                    type="number"
                                    name="engineer_id"
                                    value={
                                        formData.engineer_id
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="1"
                                    required
                                    placeholder="Contoh: 1"
                                />

                            </div>

                            {/* PRIORITY */}

                            <div className="maintenance-field">

                                <label>
                                    Priority
                                </label>

                                <select
                                    name="priority"
                                    value={
                                        formData.priority
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="LOW">
                                        LOW
                                    </option>

                                    <option value="MEDIUM">
                                        MEDIUM
                                    </option>

                                    <option value="HIGH">
                                        HIGH
                                    </option>

                                </select>

                            </div>

                            {/* DESCRIPTION */}

                            <div className="maintenance-field">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    placeholder="Jelaskan masalah equipment"
                                />

                            </div>

                            {/* ACTION */}

                            <div className="maintenance-form-actions">

                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={() =>
                                        setModalOpen(
                                            false
                                        )
                                    }
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    className="primary-btn"
                                >
                                    Simpan Request
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Maintenance;
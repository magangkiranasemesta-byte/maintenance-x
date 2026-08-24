import { useEffect, useState } from "react";
import {
    Plus,
    X,
    Wrench,
    ArrowUpDown,
    ChevronUp,
    ChevronDown
} from "lucide-react";

const API = "http://localhost:3000";

function Maintenance() {
    const [requests, setRequests] = useState([]);
    const [equipment, setEquipment] = useState([]);

    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

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

    console.log("USER LOGIN:", user);
    console.log("ROLE LOGIN:", user?.role);

    const userRole = String(
        user?.role || ""
    ).trim().toLowerCase();

    console.log(
        "ROLE NORMALIZED:",
        userRole
    );

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

            const data =
                await response.json();

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

            const data =
                await response.json();

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

        try {
            const body = {
                equipment_id:
                    Number(
                        formData.equipment_id
                    ),

                engineer_id:
                    Number(
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

                    body:
                        JSON.stringify(body)
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Gagal membuat request"
                );
            }

            showAlert(
                `Maintenance request berhasil ditambahkan. ID: ${result.id}`,
                "success"
            );

            setFormData({
                equipment_id: "",
                engineer_id: "",
                priority: "MEDIUM",
                description: ""
            });

            setModalOpen(false);

            loadRequests();

        } catch (error) {
            console.error(
                "Create maintenance error:",
                error
            );

            showAlert(
                error.message,
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

        return new Date(
            date
        ).toLocaleDateString(
            "id-ID"
        );
    };

    // =====================================================
    // HANDLE SORT
    // =====================================================

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction:
                prev.key === key &&
                prev.direction === "asc"
                    ? "desc"
                    : "asc"
        }));
    };

    // =====================================================
    // GET SORT VALUE
    // =====================================================

    const getSortValue = (item, key) => {
        switch (key) {

            case "id":
                return (
                    Number(item.id) || 0
                );

            case "equipment":
                return (
                    `Equipment #${
                        item.equipment_id || ""
                    }`
                ).toLowerCase();

            case "engineer":
                return (
                    Number(
                        item.engineer_id
                    ) || 0
                );

            case "description":
                return (
                    item.description || ""
                )
                    .toString()
                    .toLowerCase();

            case "priority":
                return (
                    item.priority || ""
                )
                    .toString()
                    .toLowerCase();

            case "status":
                return (
                    item.status || ""
                )
                    .toString()
                    .toLowerCase();

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
    // SORT DATA
    // =====================================================

    const sortedRequests =
        [...requests].sort(
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

                if (valueA < valueB) {
                    return (
                        sortConfig.direction ===
                        "asc"
                            ? -1
                            : 1
                    );
                }

                if (valueA > valueB) {
                    return (
                        sortConfig.direction ===
                        "asc"
                            ? 1
                            : -1
                    );
                }

                return 0;
            }
        );

    // =====================================================
    // SORT HEADER COMPONENT
    // =====================================================

    const SortableHeader = ({
        label,
        sortKey
    }) => {

        const active =
            sortConfig.key === sortKey;

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

                {/* REQUEST BUTTON */}

                {userRole === "engineer" && (

                    <button
                        className="primary-btn"
                        onClick={openModal}
                    >

                        <Plus size={16} />

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

                            ) : requests.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="maintenance-table-message"
                                    >
                                        Belum ada maintenance request.
                                    </td>

                                </tr>

                            ) : (

                                sortedRequests.map(
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

                                                        Equipment #

                                                        {
                                                            item.equipment_id
                                                        }

                                                    </span>

                                                </div>

                                            </td>


                                            {/* ENGINEER */}

                                            <td>
                                                {
                                                    item.engineer_id
                                                }
                                            </td>


                                            {/* DESCRIPTION */}

                                            <td>
                                                {
                                                    item.description
                                                }
                                            </td>


                                            {/* PRIORITY */}

                                            <td>

                                                <span
                                                    className={`maintenance-priority ${
                                                        String(
                                                            item.priority ||
                                                            ""
                                                        ).toLowerCase()
                                                    }`}
                                                >

                                                    {
                                                        item.priority
                                                    }

                                                </span>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span className="maintenance-status">

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

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

                {/* =================================================
                    SORT INFO
                ================================================= */}

                {!loading &&
                    requests.length > 0 &&
                    sortConfig.key && (

                    <div className="maintenance-sort-footer">

                        <span>
                            Sorting:{" "}
                            <strong>
                                {sortConfig.key}
                            </strong>{" "}
                            (
                            {sortConfig.direction ===
                            "asc"
                                ? "Ascending ↑"
                                : "Descending ↓"}
                            )
                        </span>

                        <button
                            type="button"
                            onClick={
                                resetSort
                            }
                            className="maintenance-reset-sort"
                        >
                            Reset Sorting
                        </button>

                    </div>

                )}

            </section>


            {/* =================================================
                MODAL
            ================================================= */}

            {modalOpen &&
                userRole === "engineer" && (

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
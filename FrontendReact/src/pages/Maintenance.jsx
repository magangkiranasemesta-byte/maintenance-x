import { useEffect, useState } from "react";
import { Plus, X, Wrench } from "lucide-react";

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
        description: "",
    });


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
    // LOAD EQUIPMENT
    // =========================

    const loadEquipment = async () => {
        try {
            const response = await fetch(
                `${API}/api/equipment`
            );

            if (!response.ok) {
                throw new Error("Gagal mengambil equipment");
            }

            const data = await response.json();

            setEquipment(
                Array.isArray(data) ? data : []
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


    // =========================
    // LOAD MAINTENANCE
    // =========================

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
                Array.isArray(data) ? data : []
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


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        loadRequests();
        loadEquipment();

    }, []);


    // =========================
    // HANDLE FORM
    // =========================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // =========================
    // OPEN MODAL
    // =========================

    const openModal = () => {

        setModalOpen(true);

        loadEquipment();
    };


    // =========================
    // SUBMIT REQUEST
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const body = {
                equipment_id:
                    Number(formData.equipment_id),

                engineer_id:
                    Number(formData.engineer_id),

                description:
                    formData.description.trim(),

                priority:
                    formData.priority,
            };


            const response = await fetch(
                `${API}/api/maintenance`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(body),
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
                description: "",
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


    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "id-ID"
        );
    };


    return (

        <div className="maintenance-page">


            {/* =====================
                HEADER
            ====================== */}

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


                <button
                    className="primary-btn"
                    onClick={openModal}
                >

                    <Plus size={16} />

                    Request Maintenance

                </button>

            </header>


            {/* =====================
                ALERT
            ====================== */}

            {message && (

                <div
                    className={`maintenance-alert ${messageType}`}
                >
                    {message}
                </div>

            )}


            {/* =====================
                TABLE
            ====================== */}

            <section className="maintenance-content-card">

                <div className="maintenance-table-wrap">

                    <table className="maintenance-table">

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
                                    DESKRIPSI
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

                                requests.map((item) => (

                                    <tr key={item.id}>

                                        <td>
                                            {item.id}
                                        </td>


                                        <td>

                                            <div className="maintenance-equipment">

                                                <div className="maintenance-equipment-icon">

                                                    <Wrench size={13} />

                                                </div>

                                                <span>
                                                    Equipment #
                                                    {item.equipment_id}
                                                </span>

                                            </div>

                                        </td>


                                        <td>
                                            {item.engineer_id}
                                        </td>


                                        <td>
                                            {item.description}
                                        </td>


                                        <td>

                                            <span
                                                className={`maintenance-priority ${
                                                    String(
                                                        item.priority || ""
                                                    ).toLowerCase()
                                                }`}
                                            >
                                                {item.priority}
                                            </span>

                                        </td>


                                        <td>

                                            <span className="maintenance-status">
                                                {item.status}
                                            </span>

                                        </td>


                                        <td>
                                            {formatDate(
                                                item.created_at
                                            )}
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </section>


            {/* =====================
                MODAL
            ====================== */}

            {modalOpen && (

                <div
                    className="maintenance-modal"
                    onClick={(e) => {

                        if (
                            e.target.className ===
                            "maintenance-modal"
                        ) {
                            setModalOpen(false);
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
                                    setModalOpen(false)
                                }
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
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
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        -- Pilih Equipment --
                                    </option>


                                    {equipment.map(
                                        (item) => (

                                            <option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.equipment_code}
                                                {" - "}
                                                {item.name}
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
                                    onChange={handleChange}
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
                                    onChange={handleChange}
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
                                    onChange={handleChange}
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
                                        setModalOpen(false)
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
import { useEffect, useState } from "react";
import { Plus, X, Settings } from "lucide-react";

const API = "http://localhost:3000";

function Equipment() {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const [formData, setFormData] = useState({
        equipment_code: "",
        name: "",
        location: "",
        description: "",
        status: "ACTIVE",
    });

    // =========================
    // AMBIL DATA EQUIPMENT
    // =========================
    const loadEquipment = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${API}/api/equipment`);

            if (!response.ok) {
                throw new Error("Gagal mengambil data equipment");
            }

            const data = await response.json();

            setEquipment(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Load equipment error:", error);

            setMessage("Gagal mengambil data. Pastikan backend Node.js berjalan.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEquipment();
    }, []);

    // =========================
    // HANDLE INPUT
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // TAMBAH EQUIPMENT
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API}/api/equipment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Gagal menambahkan equipment"
                );
            }

            setMessage(
                `Equipment berhasil ditambahkan. ID: ${result.id}`
            );

            setMessageType("success");

            setFormData({
                equipment_code: "",
                name: "",
                location: "",
                description: "",
                status: "ACTIVE",
            });

            setModalOpen(false);

            loadEquipment();
        } catch (error) {
            console.error("Add equipment error:", error);

            setMessage(error.message);
            setMessageType("error");
        }
    };

    return (
        <div className="equipment-page">

            {/* HEADER */}
            <div className="equipment-page-header">

                <div>
                    <span className="page-label">
                        Equipment
                    </span>

                    <h1>
                        Equipment
                    </h1>

                    <p>
                        Kelola data equipment yang tersimpan di database.
                    </p>
                </div>

                <button
                    className="primary-btn"
                    onClick={() => setModalOpen(true)}
                >
                    <Plus size={16} />
                    Tambah Equipment
                </button>

            </div>


            {/* ALERT */}
            {message && (
                <div className={`equipment-alert ${messageType}`}>
                    {message}
                </div>
            )}


            {/* TABLE */}
            <div className="equipment-content-card">

                <div className="equipment-table-wrap">

                    <table className="equipment-table">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>KODE</th>
                                <th>NAMA</th>
                                <th>LOKASI</th>
                                <th>DESKRIPSI</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>
                                    <td
                                        colSpan="6"
                                        className="table-message"
                                    >
                                        Memuat data...
                                    </td>
                                </tr>

                            ) : equipment.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="6"
                                        className="table-message"
                                    >
                                        Belum ada equipment.
                                    </td>
                                </tr>

                            ) : (

                                equipment.map((item) => (

                                    <tr key={item.id}>

                                        <td>
                                            {item.id}
                                        </td>

                                        <td>
                                            <strong>
                                                {item.equipment_code}
                                            </strong>
                                        </td>

                                        <td>
                                            <div className="equipment-name-cell">

                                                <div className="equipment-small-icon">
                                                    <Settings size={13} />
                                                </div>

                                                <span>
                                                    {item.name}
                                                </span>

                                            </div>
                                        </td>

                                        <td>
                                            {item.location}
                                        </td>

                                        <td>
                                            {item.description || "-"}
                                        </td>

                                        <td>

                                            <span
                                                className={`equipment-status ${
                                                    String(item.status || "")
                                                        .toLowerCase()
                                                }`}
                                            >
                                                {item.status}
                                            </span>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* MODAL */}
            {modalOpen && (

                <div className="equipment-modal">

                    <div className="equipment-modal-box">

                        {/* MODAL HEADER */}
                        <div className="equipment-modal-header">

                            <div>
                                <h2>
                                    Tambah Equipment
                                </h2>

                                <p>
                                    Masukkan informasi equipment baru.
                                </p>
                            </div>

                            <button
                                className="close-modal"
                                onClick={() => setModalOpen(false)}
                            >
                                <X size={20} />
                            </button>

                        </div>


                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="equipment-form"
                        >

                            <div className="equipment-form-grid">

                                <div className="equipment-field">

                                    <label>
                                        Kode Equipment
                                    </label>

                                    <input
                                        type="text"
                                        name="equipment_code"
                                        value={formData.equipment_code}
                                        onChange={handleChange}
                                        placeholder="EQ-007"
                                        required
                                    />

                                </div>


                                <div className="equipment-field">

                                    <label>
                                        Nama Equipment
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Mesin Produksi 01"
                                        required
                                    />

                                </div>


                                <div className="equipment-field">

                                    <label>
                                        Lokasi
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Area Produksi"
                                        required
                                    />

                                </div>


                                <div className="equipment-field">

                                    <label>
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="ACTIVE">
                                            ACTIVE
                                        </option>

                                        <option value="INACTIVE">
                                            INACTIVE
                                        </option>
                                    </select>

                                </div>


                                <div className="equipment-field full">

                                    <label>
                                        Deskripsi
                                    </label>

                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Keterangan equipment"
                                    />

                                </div>

                            </div>


                            {/* BUTTON */}
                            <div className="equipment-form-actions">

                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    className="primary-btn"
                                >
                                    Simpan
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Equipment;
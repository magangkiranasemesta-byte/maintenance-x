import { useEffect, useState } from "react";
import {
    Plus,
    X,
    Settings,
    LoaderCircle,
    Trash2
} from "lucide-react";

const API = "http://100.88.123.49:3000";

function Equipment() {

    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);

    // Loading khusus saat menyimpan
    const [saving, setSaving] = useState(false);

    const [deletingId, setDeletingId] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [alert, setAlert] = useState({
        show: false,
        message: "",
        type: ""
    });

    const [form, setForm] = useState({
        equipment_code: "",
        name: "",
        location: "",
        description: "",
        status: "ACTIVE"
    });


    // =========================
    // LOAD EQUIPMENT
    // =========================

    const loadEquipment = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                `${API}/api/equipment`
            );

            if (!response.ok) {
                throw new Error(
                    "API equipment tidak dapat diakses"
                );
            }

            const data = await response.json();

            console.log("Data equipment:", data);

            setEquipment(data);

        } catch (error) {

            console.error(
                "ERROR LOAD EQUIPMENT:",
                error
            );

            setEquipment([]);

            showAlert(
                error.message ||
                "Gagal mengambil data equipment",
                "error"
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // ALERT
    // =========================

    const showAlert = (message, type) => {

        setAlert({
            show: true,
            message,
            type
        });

        setTimeout(() => {

            setAlert({
                show: false,
                message: "",
                type: ""
            });

        }, 3500);
    };


    // =========================
    // FORM CHANGE
    // =========================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));

    };


    // =========================
    // ADD EQUIPMENT
    // =========================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (saving) return;

        setSaving(true);

        try {

            const response = await fetch(
                `${API}/api/equipment`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(form)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Gagal menambah equipment"
                );
            }

            showAlert(
                `Equipment berhasil ditambahkan. ID: ${result.id}`,
                "success"
            );

            setForm({
                equipment_code: "",
                name: "",
                location: "",
                description: "",
                status: "ACTIVE"
            });

            setModalOpen(false);

            // Matikan loading setelah POST berhasil
            setSaving(false);

            // Ambil data terbaru
            loadEquipment();

        } catch (error) {

            console.error(
                "ERROR TAMBAH EQUIPMENT:",
                error
            );

            showAlert(
                error.message ||
                "Gagal menambahkan equipment",
                "error"
            );

            setSaving(false);
        }
    };

    // =========================
    // DELETE EQUIPMENT
    // =========================

    const handleDelete = async (id, name) => {

        const confirmed = window.confirm(
            `Apakah kamu yakin ingin menghapus equipment "${name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            setDeletingId(id);

            const response = await fetch(
                `${API}/api/equipment/${id}`,
                {
                    method: "DELETE"
                }
            );

            const result = await response.json();

            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Gagal menghapus equipment"
                );

            }

            // Hapus langsung dari UI
            setEquipment(prev =>
                prev.filter(item => item.id !== id)
            );

            showAlert(
                `Equipment "${name}" berhasil dihapus`,
                "success"
            );

        } catch (error) {

            console.error(
                "ERROR DELETE EQUIPMENT:",
                error
            );

            showAlert(
                error.message ||
                "Gagal menghapus equipment",
                "error"
            );

        } finally {

            setDeletingId(null);

        }
    };

    // =========================
    // LOAD INITIAL DATA
    // =========================

    useEffect(() => {

        loadEquipment();

    }, []);


    return (

        <div className="equipment-page">


            {/* =========================
                HEADER
            ========================= */}

            <header className="equipment-page-header">

                <div>

                    <span className="page-label">
                        Equipment
                    </span>

                    <h1>
                        Equipment
                    </h1>

                    <p>
                        Kelola data equipment yang tersimpan
                        di database.
                    </p>

                </div>


                <button
                    className="primary-btn"
                    onClick={() => setModalOpen(true)}
                    disabled={saving}
                >

                    <Plus size={16} />

                    Tambah Equipment

                </button>

            </header>


            {/* =========================
                ALERT
            ========================= */}

            {alert.show && (

                <div
                    className={`equipment-alert ${alert.type}`}
                >

                    {alert.message}

                </div>

            )}


            {/* =========================
                TABLE CARD
            ========================= */}

            <section className="equipment-content-card">

                <div className="equipment-table-wrap">

                    <table className="equipment-table">

                        <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    KODE
                                </th>

                                <th>
                                    NAMA
                                </th>

                                <th>
                                    LOKASI
                                </th>

                                <th>
                                    DESKRIPSI
                                </th>

                                <th>
                                    STATUS
                                </th>

                                <th>
                                    AKSI
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="table-message"
                                    >

                                        <LoaderCircle
                                            size={18}
                                            className="loading-icon"
                                        />

                                        Memuat data...

                                    </td>

                                </tr>

                            ) : equipment.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
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

                                                    <Settings
                                                        size={13}
                                                    />

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
                                                    item.status?.toLowerCase()
                                                }`}
                                            >

                                                {item.status}

                                            </span>

                                        </td>
                                        
                                        <td>
                                            <button
                                                type="button"
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(
                                                        item.id,
                                                        item.name
                                                    )
                                                }
                                                disabled={deletingId === item.id}
                                            >

                                                {deletingId === item.id ? (

                                                    <LoaderCircle
                                                        size={16}
                                                        className="loading-icon"
                                                    />

                                                ) : (

                                                    <Trash2 size={16} />

                                                )}

        </button>
                                        </td>
                    

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </section>


            {/* =========================
                MODAL
            ========================= */}

            {modalOpen && (

                <div
                    className="equipment-modal"
                    onClick={(event) => {

                        if (
                            event.target.className ===
                            "equipment-modal" &&
                            !saving
                        ) {

                            setModalOpen(false);

                        }

                    }}
                >

                    <div className="equipment-modal-box">


                        {/* =========================
                            MODAL HEADER
                        ========================= */}

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
                                onClick={() =>
                                    !saving &&
                                    setModalOpen(false)
                                }
                                disabled={saving}
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* =========================
                            FORM
                        ========================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="equipment-form"
                        >

                            <div className="equipment-form-grid">


                                {/* KODE */}

                                <div className="equipment-field">

                                    <label>
                                        Kode Equipment
                                    </label>

                                    <input
                                        type="text"
                                        name="equipment_code"
                                        value={
                                            form.equipment_code
                                        }
                                        onChange={handleChange}
                                        placeholder="EQ-007"
                                        required
                                        disabled={saving}
                                    />

                                </div>


                                {/* NAMA */}

                                <div className="equipment-field">

                                    <label>
                                        Nama Equipment
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Mesin Produksi 01"
                                        required
                                        disabled={saving}
                                    />

                                </div>


                                {/* LOKASI */}

                                <div className="equipment-field">

                                    <label>
                                        Lokasi
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={form.location}
                                        onChange={handleChange}
                                        placeholder="Area Produksi"
                                        required
                                        disabled={saving}
                                    />

                                </div>


                                {/* STATUS */}

                                <div className="equipment-field">

                                    <label>
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        disabled={saving}
                                    >

                                        <option value="ACTIVE">
                                            ACTIVE
                                        </option>

                                        <option value="INACTIVE">
                                            INACTIVE
                                        </option>

                                    </select>

                                </div>


                                {/* DESCRIPTION */}

                                <div className="equipment-field full">

                                    <label>
                                        Deskripsi
                                    </label>

                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Keterangan equipment"
                                        disabled={saving}
                                    />

                                </div>

                            </div>


                            {/* =========================
                                FORM ACTION
                            ========================= */}

                            <div className="equipment-form-actions">

                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={() =>
                                        !saving &&
                                        setModalOpen(false)
                                    }
                                    disabled={saving}
                                >

                                    Batal

                                </button>


                                <button
                                    type="submit"
                                    className="primary-btn"
                                    disabled={saving}
                                >

                                    {saving ? (

                                        <>
                                            <LoaderCircle
                                                size={16}
                                                className="loading-icon"
                                            />

                                            Menyimpan...
                                        </>

                                    ) : (

                                        <>
                                            Simpan
                                        </>

                                    )}

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
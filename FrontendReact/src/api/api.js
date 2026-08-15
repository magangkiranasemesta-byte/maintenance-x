const API_URL = "http://localhost:3000";

export async function getEquipment() {
    const response = await fetch(`${API_URL}/api/equipment`);

    if (!response.ok) {
        throw new Error("Gagal mengambil data equipment");
    }

    return response.json();
}

export async function getMaintenance() {
    const response = await fetch(`${API_URL}/api/maintenance`);

    if (!response.ok) {
        throw new Error("Gagal mengambil data maintenance");
    }

    return response.json();
}
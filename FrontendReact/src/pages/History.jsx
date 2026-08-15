import { History as HistoryIcon } from "lucide-react";

function History() {
    return (
        <div className="history-page">

            {/* HEADER */}
            <div className="history-page-header">

                <div>
                    <span className="page-label">
                        History
                    </span>

                    <h1>
                        History
                    </h1>

                    <p>
                        Riwayat seluruh aktivitas maintenance equipment.
                    </p>
                </div>

            </div>


            {/* CONTENT */}
            <div className="history-card">

                <div className="history-content">

                    <div className="history-icon">
                        <HistoryIcon size={24} />
                    </div>

                    <h3>
                        Halaman History siap digunakan
                    </h3>

                    <p>
                        Data history dapat dihubungkan setelah
                        endpoint history dibuat.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default History;
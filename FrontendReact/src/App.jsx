import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Equipment from "./pages/Equipment";
import Maintenance from "./pages/Maintenance";
import Approval from "./pages/Approval";
import History from "./pages/History";

function App() {
    return (
        <BrowserRouter>
            <div className="app-layout">

                <Sidebar />

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/equipment" element={<Equipment />} />
                        <Route path="/maintenance" element={<Maintenance />} />
                        <Route path="/approval" element={<Approval />} />
                        <Route path="/history" element={<History />} />
                    </Routes>
                </main>

            </div>
        </BrowserRouter>
    );
}

export default App;
import { Navigate } from "react-router-dom";
import { rolePermissions } from "../config/permissions";

function RoleRoute({ children, permission }) {

    const userData = localStorage.getItem("user");

    if (!userData) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(userData);

    const role = user.role?.toLowerCase();

    const permissions = rolePermissions[role];

    // Role tidak terdaftar
    if (!permissions) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Tidak punya permission
    if (!permissions[permission]) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

export default RoleRoute;
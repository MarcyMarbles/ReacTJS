import Cookies from "js-cookie";
import { useState, useEffect } from "react";

export const useAdminAuth = () => {
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        const token = Cookies.get("token");
        const roles = Cookies.get("role");

        if (token && roles?.includes("ROLE_ADMIN")) {
            setHasPermission(true);
        } else {
            setHasPermission(false);
        }
    }, []);

    return { hasPermission };
};
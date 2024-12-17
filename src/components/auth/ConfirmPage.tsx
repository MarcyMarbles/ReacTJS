import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConfirm } from "../../api/api";

const ConfirmPage = () => {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const navigate = useNavigate();

    useEffect(() => {
        const confirmAccount = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");

            if (!code) {
                setStatus("error");
                return;
            }

            try {
                const response = await fetch(apiConfirm, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code }),
                });

                if (!response.ok) {
                    throw new Error("Confirmation failed");
                }

                setStatus("success");

                
                setTimeout(() => navigate("/login"), 2000);
            } catch (error) {
                console.error(error);
                setStatus("error");
            }
        };

        confirmAccount();
    }, [navigate]);

    return (
        <div>
            {status === "loading" && <p>Confirming your account, please wait...</p>}
            {status === "success" && <p>Account confirmed successfully! Redirecting to login...</p>}
            {status === "error" && <p>Error confirming account. Please try again.</p>}
        </div>
    );
};

export default ConfirmPage;

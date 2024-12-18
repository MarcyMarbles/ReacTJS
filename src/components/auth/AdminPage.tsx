import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAdminAuth } from "./useAdminAuth";
import { apiAllUsers } from "../../api/api";
import axios from "axios";

type Role = {
    name: string;
};

interface User {
    id: number;
    login: string;
    username: string;
    password: string;
    roles: Role[] | null;
}

const AdminPage = () => {
    const { hasPermission } = useAdminAuth();
    const [rows, setRows] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!hasPermission) return;

        const fetchData = async () => {
            try {
                const response = await axios.get(apiAllUsers, {
                    params: { page: 0, size: 1000000 },
                });
                setRows(response.data);
            } catch (err) {
                setError("Failed to load data. Please check your authentication.");
            }
        };

        fetchData();

        const token = Cookies.get("token");
        const ws = new WebSocket(`ws://172.20.10.3:8080/ws/users?token=${token}`);

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            handleWebSocketMessage(message);
        };

        ws.onclose = () => console.log("WebSocket connection closed.");
        ws.onerror = (error) => console.error("WebSocket error:", error);

        return () => ws.close();
    }, [hasPermission]);

    const handleWebSocketMessage = (message: any) => {
        if (message.type === "BATCH") {
            setRows((prevRows) => {
                let updatedRows = [...prevRows];
                message.data.forEach((update: any) => {
                    switch (update.type) {
                        case "CREATE":
                            updatedRows.push(update.data);
                            break;
                        case "UPDATE":
                            updatedRows = updatedRows.map((row) =>
                                row.id === update.data.id ? { ...row, ...update.data } : row
                            );
                            break;
                        case "DELETE":
                            updatedRows = updatedRows.filter((row) => row.id !== update.data.id);
                            break;
                        default:
                            console.error("Unknown batch update type:", update.type);
                    }
                });
                return updatedRows;
            });
        }
    };

    const handleAddUser = async () => {
        try {
            const newUser: User = {
                id: 0,
                login: `user${rows.length + 1}`,
                username: `User #${rows.length + 1}`,
                password: "password123",
                roles: null,
            };

            const response = await axios.post("http://172.20.10.3:8080/api/addUser", newUser);
            if (response.status === 200) {
                console.log("User added successfully:", response.data);
                setRows((prevRows) => [...prevRows, response.data]);
            } else {
                alert(response.data || "Failed to add user");
            }
        } catch (err) {
            alert("An error occurred while adding the user.");
        }
    };

    const handleDeleteUser = async (id: number) => {
        try {
            const response = await axios.delete(`http://172.20.10.3:8080/api/deleteUser/${id}`);
            if (response.status === 200) {
                setRows((prevRows) => prevRows.filter((row) => row.id !== id));
            } else {
                alert(response.data || "Failed to delete user");
            }
        } catch (err) {
            alert("An error occurred while deleting the user.");
        }
    };

    if (!hasPermission) {
        return <p className="error">NOT ENOUGH PERMISSION</p>;
    }

    return (
        <div className="data-grid-container">
            <h1>User Table</h1>
            <button onClick={handleAddUser}>Add User</button>
            <table>
                <thead>
                    <tr>
                        <th>Login</th>
                        <th>Username</th>
                        <th>Roles</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id}>
                            <td>{row.login}</td>
                            <td>{row.username}</td>
                            <td>
                                {row.roles?.map((role) => role.name).join(", ") || "No Roles"}
                            </td>
                            <td>
                                <button
                                    onClick={() => {
                                        if (window.confirm(`Delete user ${row.username}?`)) {
                                            handleDeleteUser(row.id);
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default AdminPage;

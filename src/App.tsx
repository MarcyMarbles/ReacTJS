import {useState, useEffect} from "react";
import "./App.css";
import api from "./api";
import {ReactDataGrid} from "@ezgrid/grid-react";
import {createColumn, getApi, GridSelectionMode} from "@ezgrid/grid-core";

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

const App = () => {
    const [rows, setRows] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState(true);
    let currentRow: User | null = null;

    useEffect(() => {
        const roles = localStorage.getItem("role");
        if (!roles || !roles.includes("ROLE_ADMIN")) {
            setHasPermission(false);
            return;
        }

        const fetchData = async () => {
            try {
                const response = await api.get("api/users", {
                    params: {
                        page: 0,
                        size: 1000000,
                    },
                });
                setRows(response.data);
                console.log("Data loaded successfully:", response.data);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Failed to load data. Please check your authentication.");
            }
        };

        fetchData();

        const token = localStorage.getItem("token");
        const ws = new WebSocket(`ws://localhost:8080/ws/users?token=${token}`);

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log("WebSocket message received:", message);

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
                } else {
                    switch (message.type) {
                        case "CREATE":
                            setRows((prevRows) => [...prevRows, message.data]);
                            break;
                        case "UPDATE":
                            setRows((prevRows) =>
                                prevRows.map((row) =>
                                    row.id === message.data.id ? { ...row, ...message.data } : row
                                )
                            );
                            break;
                        case "DELETE":
                            setRows((prevRows) => prevRows.filter((row) => row.id !== message.data.id));
                            break;
                        default:
                            console.error("Unknown message type:", message.type);
                    }
                }
            } catch (err) {
                console.error("Failed to process WebSocket message:", err, event.data);
            }
        };

        ws.onclose = () => console.log("WebSocket connection closed.");
        ws.onerror = (error) => console.error("WebSocket error:", error);

        return () => ws.close();
    }, []);

    const handleAddUser = async () => {
        try {
            const userNumber = rows.length + 1;
            const newUser: User = {
                id: 0,
                login: `user${userNumber}`,
                password: "password123",
                username: `User #${userNumber}`,
                roles: null,
            };

            const response = await api.post("api/addUser", newUser);
            if (response.status === 200) {
                console.log("User added successfully:", response.data);
            } else {
                console.error("Failed to add user:", response.data);
                alert(response.data || "Failed to add user");
            }
        } catch (err) {
            console.error("Error adding user:", err);
            alert("An error occurred while adding the user.");
        }
    };

    const handleDeleteUser = async () => {
        if (!currentRow) {
            alert("Please select a row to delete.");
            return;
        }
    
        try {
            const response = await api.delete(`api/deleteUser/${currentRow.id}`);
            if (response.status === 200) {
                console.log("User deleted successfully:", currentRow);
                setRows((prevRows) => prevRows.filter((row) => row.id !== currentRow.id));
                currentRow = null;
            } else {
                console.error("Failed to delete user:", response.data);
                alert(response.data || "Failed to delete user");
            }
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("An error occurred while deleting the user.");
        }
    };

    if (!hasPermission) {
        return <p className="error">NOT ENOUGH PERMISSION</p>;
    }

    return (
        <div className="data-grid-container">
            <h1>User Table</h1>
            <button className="add-user-btn" onClick={handleAddUser}>
                Add User
            </button>
            <button className="delete-user-btn" onClick={handleDeleteUser}>
                Delete User
            </button>
            {error ? (
                <p className="error">{error}</p>
            ) : (
                <ReactDataGrid
                    gridOptions={{
                        enableFilters: true,
                        enablePaging: true,
                        rowStyleFunction: (node) => {
                            const api = getApi(node);
                            const selectedRows = api.getSelectedRows();
                        
                            if (selectedRows.length > 0) {
                                currentRow = selectedRows[0] as User;
                            } else {
                                currentRow = null;
                            }
                        
                            return {};
                        },
                        selectionMode: GridSelectionMode.SingleRow,
                        dataProvider: rows,
                        uniqueIdentifierOptions: { useField: "id" },
                        columns: [
                            createColumn("login", "string", "Login"),
                            createColumn("username", "string", "Username"),
                            createColumn("roles.name", "string", "Role"),
                        ],
                    }}
                    style={{ height: "500px", width: "100%" }}
                />
            )}
        </div>
    );
};

export default App;
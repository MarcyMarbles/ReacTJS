import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface User {
    id: string;
    login: string;
    username: string;
    email: string;
    roles: { id: string; name: string };
    avatar: { id: string; path: string };
    friends: string[];
    isGroup: boolean;
    isPending: boolean;
}

interface FriendsDTO {
    user: User;
    isFriend: boolean;
}

const SearchUsers: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState<FriendsDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm) return;

        setLoading(true);
        setError(null);

        try {
            const token = Cookies.get("token");
            const response = await axios.get(
                `http://localhost:8080/api/friends/find`,
                {
                    params: { username: searchTerm },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "userId": Cookies.get("id") || "0",
                    },
                }
            );

            setUsers(response.data);
        } catch (err: any) {
            setError(err.response?.data || ""); // Empty
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleAddFriend = async (userId: string) => {
        try {
            const token = Cookies.get("token");
            await axios.post(
                `http://localhost:8080/api/friends/add`,
                { userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "userId": Cookies.get("id") || "0",
                    },
                }
            );

            setUsers((prevUsers) =>
                prevUsers.map((friendDTO) =>
                    friendDTO.user.id === userId
                        ? { ...friendDTO, isFriend: true }
                        : friendDTO
                )
            );
        } catch (err: any) {
            setError(err.response?.data || "Failed to add friend");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h1>Search Users</h1>

            <input
                type="text"
                placeholder="Enter username"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            {users.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
                    {users.map(({ user, isFriend }) => (
                        <li
                            key={user.id}
                            style={{
                                padding: "10px",
                                borderBottom: "1px solid #ddd",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <img
                                    src={user.avatar?.path || "https://via.placeholder.com/50"}
                                    alt="Avatar"
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "50%",
                                        marginRight: "10px",
                                    }}
                                />
                                <div>
                                    <a
                                        href={`user/profile/${user.username}`}
                                        style={{
                                            textDecoration: "none",
                                            color: "blue",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {user.username}
                                    </a>
                                    <p style={{ margin: 0, color: "gray" }}>{user.email}</p>
                                </div>
                            </div>
                            {!isFriend && (
                                <button
                                    onClick={() => handleAddFriend(user.id)}
                                    style={{
                                        padding: "5px 10px",
                                        cursor: "pointer",
                                        backgroundColor: "blue",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                    }}
                                >
                                    Add Friend
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchUsers;

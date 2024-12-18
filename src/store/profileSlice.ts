import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

export interface NewsItem {
    content: string;
    attachments: string[];
    author: {
        id: string;
        username: string;
        email: string;
    };
    likes: string[];
    dislikes: string[];
    comments: string[];
}

export interface ProfileState {
    user: {
        id: string;
        login: string;
        username: string;
        email: string;
        roles: { id: string; name: string };
        avatar: { id: string; path: string };
        friends: string[];
        isGroup: boolean;
        isPending: boolean;
    } | null;
    news: NewsItem[];
    isFollowing: boolean;
    isSelf: boolean;
    status: "idle" | "loading" | "failed";
}

const initialState: ProfileState = {
    user: null,
    news: [],
    isFollowing: false,
    isSelf: false,
    status: "idle",
};

export const fetchProfile = createAsyncThunk(
    "profile/fetchProfile",
    async ({ username }: { username: string }, { rejectWithValue }) => {
        const token = Cookies.get("token");
        console.log("Token:", token);
        try {
            const response = await axios.post(`http://192.168.0.17:8080/api/user/profile/${username}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || "Failed to fetch profile");
        }
    }
);

export const editProfile = createAsyncThunk(
    "profile/editProfile",
    async ({ username, upDatedData }: { username: string; upDatedData: any }, { rejectWithValue }) => {
        try {
            const token = Cookies.get("token");

            const response = await axios.post(
                `http://192.168.0.17:8080/api/user/profile/${username}`,
                upDatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || "Failed to edit profile");
        }
    }
);

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.user = null;
            state.isFollowing = false;
            state.isSelf = false;
        },
        logout: (state) => {
            state.user = null;
            state.isFollowing = false;
            state.isSelf = false;
            Cookies.remove('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<ProfileState>) => {
                state.user = action.payload.user;
                state.news = action.payload.news;
                state.isFollowing = action.payload.isFollowing;
                state.isSelf = action.payload.isSelf;
                state.status = "idle";
            })
            .addCase(fetchProfile.rejected, (state) => {
                state.status = "failed";
            })
            
            .addCase(editProfile.pending, (state) => {
                state.status = "loading";
            })
            .addCase(editProfile.fulfilled, (state, action: PayloadAction<ProfileState["user"]>) => {
                state.status = "idle";
                state.user = { ...state.user, ...action.payload };
            })
            .addCase(editProfile.rejected, (state) => {
                state.status = "failed";
            });
    },
});

export const { clearProfile, logout } = profileSlice.actions;
export default profileSlice.reducer;
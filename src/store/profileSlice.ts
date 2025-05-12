import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

export interface Balance {
  id: string;
  ownerId: string;
  balance: number;
  currency: string;
}

export interface User {
  username: string;
  email: string;
}

export interface ProfileState {
  user: User | null;
  balance: Balance | null;
  status: "idle" | "loading" | "failed";
}

const initialState: ProfileState = {
    user: null,
    balance: null,
    status: "idle",
};

export const fetchProfile = createAsyncThunk(
    "profile/fetchProfile",
    async ({ username }: { username: string }, { rejectWithValue }) => {
        const token = Cookies.get("token");
        console.log("Token:", token);
        try {
            const profileRes = await axios.post(`http://localhost:8080/api/user/profile/${username}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })

            const balanceRes = await axios.get(
                `http://localhost:8080/api/balance`,
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                }
            );

            const user = profileRes.data.user;

            return {
                user: {
                  username: user.username,
                  email: user.email,
                },
                balance: balanceRes.data,
            };
        } catch (err: any) {
            return rejectWithValue(err.profileRes?.data || "Failed to fetch profile or balance");
        }
    }
);

export const editProfile = createAsyncThunk(
    "profile/editProfile",
    async ({ username, upDatedData }: { username: string; upDatedData: any }, { rejectWithValue }) => {
        try {
            const token = Cookies.get("token");

            const response = await axios.post(
                `http://localhost:8080/api/user/profile/${username}`,
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

export const deleteBalance = createAsyncThunk(
  "profile/deleteBalance",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("token");
    try {
      await axios.delete(`http://localhost:8080/api/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return null;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to delete balance");
    }
  }
);

export const topUpBalance = createAsyncThunk(
  "profile/topUpBalance",
  async (amount: number, { rejectWithValue }) => {
    const token = Cookies.get("token");
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/balance/add?amount=${amount}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to top up");
    }
  }
);

export const withdrawBalance = createAsyncThunk(
  "profile/withdrawBalance",
  async (amount: number, { rejectWithValue }) => {
    const token = Cookies.get("token");
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/balance/subtract?amount=${amount}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to withdraw");
    }
  }
);

export const getBalance = createAsyncThunk(
  "profile/getBalance",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get(`http://localhost:8080/api/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch balance");
    }
  }
);


const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.user = null;
      state.balance = null;
    },
    logout: (state) => {
      state.user = null;
      state.balance = null;
      Cookies.remove("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.balance = action.payload.balance;
        state.status = "idle";
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getBalance.fulfilled, (state, action) => {
        state.balance = action.payload;
      })
      .addCase(deleteBalance.fulfilled, (state) => {
        state.balance = null;
      })
      .addCase(topUpBalance.fulfilled, (state, action) => {
        state.balance = action.payload;
      })
      .addCase(withdrawBalance.fulfilled, (state, action) => {
        state.balance = action.payload;
      });
  },
});

export const { clearProfile, logout } = profileSlice.actions;
export default profileSlice.reducer;
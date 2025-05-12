import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";


interface Deposit {
  id: string;
  name: string;
  amount: number;
  currency: string;
}

interface Bank {
  id: string;
  name: string;
  ownerId: string;
  balance: number;
  currency: string;
  deposit: Deposit[];
}

interface BanksState {
  banks: Bank[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: BanksState = {
  banks: [],
  status: 'idle',
  error: null,
};

export const fetchBanks = createAsyncThunk('banks/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const token = Cookies.get('token');
    const res = await axios.get('/api/banks', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || 'Failed to fetch banks');
  }
});

const banksSlice = createSlice({
  name: 'banks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBanks.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchBanks.fulfilled, (state, action) => {
        state.status = 'idle';
        state.banks = action.payload;
      })
      .addCase(fetchBanks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default banksSlice.reducer;
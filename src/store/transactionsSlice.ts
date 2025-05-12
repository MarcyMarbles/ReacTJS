import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

interface Transaction {
  id: string;
  userId: string;
  balanceId: string;
  amount: number;
  initialAmount: number;
  transactionType: "income" | "expense";
  currency: string;
  createdAt: number;
}

interface TransactionState {
  data: Transaction[];
  status: "idle" | "loading" | "failed";
}

const initialState: TransactionState = {
  data: [],
  status: "idle",
};

export const fetchAllTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("token");
    try {
      const res = await axios.get("http://localhost:8080/api/transaction/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const transactions = res.data;

      if (!Array.isArray(transactions)) {
        throw new Error("Expected transaction list in 'body'");
      }

      return transactions;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch transactions");
    }
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllTransactions.pending, state => {
        state.status = "loading";
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
      })
      .addCase(fetchAllTransactions.rejected, state => {
        state.status = "failed";
      });
  },
});

export default transactionsSlice.reducer;
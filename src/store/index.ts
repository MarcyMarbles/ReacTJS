import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profileSlice";
import bankReducer from './bankSlice'
import transactionReducer from './transactionsSlice'

export const store = configureStore({
    reducer: {
        profile: profileReducer,
        banks: bankReducer,
        transactions: transactionReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

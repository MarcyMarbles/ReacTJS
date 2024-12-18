import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profileSlice";
import newsReducer from "./newsSlice";

export const store = configureStore({
    reducer: {
        profile: profileReducer,
        news: newsReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
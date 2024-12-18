import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface News {
  id: string;
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

interface NewsState {
  news: News[];
  loading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  news: [],
  loading: false,
  error: null,
};

export const fetchAllNews = createAsyncThunk<News[], void, { rejectValue: string }>(
    "news/fetchAll",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get("http://localhost:8080/api/news");
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const createNews = createAsyncThunk<
    News,
    { content: string; attachments: string[] },
    { rejectValue: string }
        >("news/create", async ({ content, attachments }, { rejectWithValue }) => {
    try {
        const response = await axios.post("http://localhost:8080/api/news/post", {
        content,
        attachments,
        });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    addNewsFromSocket: (state, action: PayloadAction<News>) => {
      state.news.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNews.fulfilled, (state, action: PayloadAction<News[]>) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchAllNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createNews.fulfilled, (state, action: PayloadAction<News>) => {
        state.news.unshift(action.payload);
      });
  },
});

export const { addNewsFromSocket } = newsSlice.actions;

export default newsSlice.reducer;

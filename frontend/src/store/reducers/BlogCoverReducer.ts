import api from "@/api/axios";
import { BlogCursorResponse, UUID } from "@/types/blog/blog-base";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const getCoverBlog = createAsyncThunk<
    BlogCursorResponse,
    { cursor: UUID | null }
>("/blog", async ({ cursor }, { rejectWithValue }) => {
    try {
        const URL = `${process.env.NEXT_PUBLIC_API_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/blog`;

        const res = await api.get(URL, {
            withCredentials: true,
            params: {
                cursor,
                page: 0,
                size: 10,
                sort: "createdAt,desc",
            },
        });
        return res.data;
    } catch (e) {
        return rejectWithValue("Failed to fetch data");
    }
});

const initialState: BlogCursorResponse = {
    loading: true,
    data: [],
    cursor: null,
    hasNext: true,
    error: null,
};

const homeBlogCoverReducers = createSlice({
    name: "homeBlogCoverReducer",
    initialState: initialState,
    reducers: {
        setData: (state, action) => {
            state.data.push(action.payload.blogPagesDto);
            (state.cursor = action.payload.cursor),
                (state.hasNext = action.payload.hasNext);
        },
    },
    extraReducers(builder) {
        builder.addCase(getCoverBlog.pending, (s) => {
            s.loading = true;
            s.error = null;
        });
        builder.addCase(getCoverBlog.fulfilled, (s, a) => {
            s.loading = false;
            s.data.push(...a.payload.blogPagesDto);
            s.cursor = a.payload.cursor;
            s.hasNext = a.payload.hasNext;
        });
        builder.addCase(getCoverBlog.rejected, (s, a) => {
            s.error = a.error.message ?? "Unknown error";
        });
    },
});

export const { setData } = homeBlogCoverReducers.actions;
export default homeBlogCoverReducers.reducer;

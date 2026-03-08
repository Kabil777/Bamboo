import api from "@/api/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { BlogHomeCard } from "@/types/blog/blog-base";

export const getFeaturedBlogs = createAsyncThunk<BlogHomeCard[]>(
    "/blog/featured",
    async (_, { rejectWithValue }) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/blog/featured`;
            const res = await api.get<BlogHomeCard[]>(url, {
                params: {
                    page: 0,
                    size: 3,
                    sort: "createdAt,desc",
                },
            });
            return res.data;
        } catch {
            return rejectWithValue("Failed to fetch featured blogs");
        }
    },
);

interface FeaturedBlogState {
    loading: boolean;
    data: BlogHomeCard[];
    error: string | null;
}

const initialState: FeaturedBlogState = {
    loading: true,
    data: [],
    error: null,
};

const featuredBlogReducer = createSlice({
    name: "featuredBlogReducer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFeaturedBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFeaturedBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getFeaturedBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) ?? "Unknown error";
            });
    },
});

export default featuredBlogReducer.reducer;

import { BlogContentState, BlogPage, UUID } from "@/types/blog/blog-base";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import api from "@/api/axios";

export const BlogPageRtk = createAsyncThunk<
    BlogPage,
    UUID,
    { state: RootState }
>("/blog/page", async (id, { getState, rejectWithValue }) => {
    const cachedData = getState().blogPageReducer.entities[id];
    if (cachedData) return cachedData;
    const URL = `${process.env.NEXT_PUBLIC_API_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/blog/${id}`;
    try {
        const res = await api.get(URL);
        console.log(res.data);
        return res.data;
    } catch (r) {
        return rejectWithValue("Failed to load blog");
    }
});

const initialState: BlogContentState = {
    entities: {},
    loadingById: {},
    errorById: {},
};

const getBlogPage = createSlice({
    name: "getBlogPage",
    initialState: initialState,
    reducers: {},
    selectors: {},
    extraReducers(builder) {
        builder.addCase(BlogPageRtk.pending, (state, action) => {
            state.loadingById[action.meta.arg] = true;
        });
        builder.addCase(BlogPageRtk.fulfilled, (state, action) => {
            state.entities[action.meta.arg] = action.payload;
            state.loadingById[action.meta.arg] = false;
        });
        builder.addCase(BlogPageRtk.rejected, (state, action) => {
            state.loadingById[action.meta.arg] = false;
            state.errorById[action.meta.arg] = action.error.message ?? null;
        });
    },
});

export default getBlogPage.reducer;

import { UUID } from "@/types/blog/blog-base";
import { Docs, DocsState } from "@/types/docs/docs-base";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import api from "@/api/axios";
import injectOverview from "@/hooks/useAddOverview";

export const DocsRTK = createAsyncThunk<Docs, UUID, { state: RootState }>(
    "/docs/id",
    async (id, { getState, rejectWithValue }) => {
        const cachedData = getState().docsReducer.entities[id];
        if (cachedData) return cachedData;
        const URL = `${process.env.NEXT_PUBLIC_API_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/docs/${id}`;
        try {
            const res = await api.get(URL);
            return res.data;
        } catch (e) {
            return rejectWithValue("Unable to fetch docs");
        }
    },
);

const initialState: DocsState = {
    entities: {},
    loadingById: {},
    errorById: {},
};
const getDocs = createSlice({
    name: "docsReducer",
    initialState: initialState,
    reducers: {},
    selectors: {},
    extraReducers(builder) {
        builder.addCase(DocsRTK.pending, (s, a) => {
            s.loadingById[a.meta.arg] = true;
        });
        builder.addCase(DocsRTK.fulfilled, (s, a) => {
            const id = a.meta.arg;
            const doc = a.payload;
            s.entities[id] = {
                ...doc,
                tree: injectOverview(doc.tree, doc.content),
            };
            s.loadingById[id] = false;
        });
        builder.addCase(DocsRTK.rejected, (s, a) => {
            const id = a.meta.arg;
            s.errorById[id] = true;
            s.loadingById[id] = false;
        });
    },
});

export default getDocs.reducer;

import api from "@/api/axios";
import { DocsHomeCard } from "@/types/docs/docs-base";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { RootState } from "../store";

export const DocsCoverRtk = createAsyncThunk<DocsHomeCard[]>(
    "/docs/home",
    async (_, { rejectWithValue }) => {
        try {
            const URL = `${process.env.NEXT_PUBLIC_API_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/docs`;

            const res: AxiosResponse = await api.get(URL);
            console.table("docs: ", res.data);
            return res.data;
        } catch (e) {
            return rejectWithValue("Failed to fetch Docs cover");
        }
    },
);

interface initialType {
    isDocsLoading: boolean;
    docs: DocsHomeCard[] | [];
    isError: boolean;
}
const initialState: initialType = {
    isDocsLoading: false,
    docs: [],
    isError: false,
};
const getCoverDocs = createSlice({
    name: "docsHomeReducer",
    initialState,
    reducers: {},
    selectors: {
        selectById: (state, id) => {
            return state.docs.find((d) => d.id === id);
        },
    },
    extraReducers(builder) {
        builder.addCase(DocsCoverRtk.pending, (state, _) => {
            state.isDocsLoading = true;
        });
        builder.addCase(DocsCoverRtk.fulfilled, (state, action) => {
            state.isDocsLoading = false;
            state.docs = action.payload;
        });
        builder.addCase(DocsCoverRtk.rejected, (state, _) => {
            state.isDocsLoading = false;
            state.isError = true;
        });
    },
});

const docsState = (state: RootState) => {
    return state.docsHomeReducer;
};
export const docsHomeSelectors = getCoverDocs.getSelectors(docsState);

export const { selectById } = getCoverDocs.selectors;
export default getCoverDocs.reducer;

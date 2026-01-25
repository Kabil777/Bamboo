import api from "@/api/axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Blog {
    title: string;
    coverUrl: string;
    description: string;
    tags: string[];
}
interface Docs {
    title: string;
    coverUrl: string;
    description: string;
    tags: string[];
}
interface CreateCoverDetailsBlogDocsState {
    id: string;
    title: string;
    type: "blog" | "docs";
    description: string;
    tags: string[];
}

export const CreateNewBlog = createAsyncThunk<{ id: string }, Blog>(
    "/blog/createNew",
    async (details, { rejectWithValue }) => {
        const URL = `${process.env.NEXT_PUBLIC_API_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/blog/meta`;
        try {
            const res = await api.post(URL, details);
            return res.data.data;
        } catch (error) {
            return rejectWithValue("Failed to create blog");
        }
    },
);

export const CreateNewDocs = createAsyncThunk<{ id: string }, Docs>(
    "/docs/createNew",
    async (details, { rejectWithValue }) => {
        const URL = `${process.env.NEXT_PUBLIC_API_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/docs/meta`;
        try {
            const res = await api.post(URL, details);
            return res.data.data;
        } catch (error) {
            return rejectWithValue("Failed to create docs");
        }
    },
);

const initialState: CreateCoverDetailsBlogDocsState = {
    id: "",
    type: "blog",
    title: "",
    description: "",
    tags: [],
};

const CreateCoverDetailsBlogDocs = createSlice({
    name: "CreateCoverDetailsBlogDocs",
    initialState: initialState,
    reducers: {
        setAll: (
            state,
            action: PayloadAction<CreateCoverDetailsBlogDocsState>,
        ) => {
            return action.payload;
        },
    },
});

export const { setAll } = CreateCoverDetailsBlogDocs.actions;

export default CreateCoverDetailsBlogDocs.reducer;

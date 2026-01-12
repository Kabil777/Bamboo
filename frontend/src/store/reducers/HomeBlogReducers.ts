import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import api from "@/api/axios";

interface AuthState {
    authenticated: boolean;
    accessToken: string | null;
    user: {
        name: string;
        email: string;
        profileImg?: string;
    } | null;
    tokenExpiration: number | null;
    status: "idle" | "loading" | "success" | "failed";
}

interface JwtPayload {
    id: string;
    name: string;
    email: string;
    profileImg: string;
    accessToken: string;
    exp: number;
}

export const getHomeBlog = createAsyncThunk(
    "/bloghome/",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post(
                "http://localhost:8080/api/v1/bloghome",
                {
                    redirectUrl:"/",
                },
                {
                    withCredentials: true,
                },
            );
            console.log(response);
            const token = response.data.token;
            const data = jwtDecode<JwtPayload>(token);

            return {
                token,
                data,
            };
        } catch (e: unknown) {
            const error = e as { response?: { status?: number; data?: string } };
            return rejectWithValue({
                status: error?.response?.status ?? 0,
                details: error?.response?.data ?? "Unknown error",
            });
        }
    },
);

const inititialBlogHomeState: AuthState = {
    authenticated: false,
    accessToken: null,
    user: {
        name: "",
        email: "",
        profileImg: "",
    },
    tokenExpiration: null,
    status: "idle",
};

const userDetailsSlice = createSlice({
    name: "userDetails",
    initialState: inititialBlogHomeState,
    reducers: {
        logout: (state) => {
            Object.assign(state, inititialBlogHomeState);
        },
        setHomeBlog: (s, a) => {
            const { token, data } = a.payload;

            s.authenticated = true;
            s.accessToken = token;
            s.user = {
                name: data.name,
                email: data.email,
                profileImg: data.profileImg,
            };
            s.tokenExpiration = data.exp;
            s.status = "success";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getHomeBlog.pending, (s) => {
                s.status = "loading";
            })
            .addCase(getHomeBlog.fulfilled, (s, a) => {
                s.authenticated = true;
                s.accessToken = a.payload.token;
                s.user = {
                    name: a.payload.data.name,
                    email: a.payload.data.email,
                    profileImg: a.payload.data.profileImg,
                };
                s.tokenExpiration = a.payload.data.exp;
                s.status = "success";
                console.log(JSON.parse(JSON.stringify(s))); //for test
            })
            .addCase(getHomeBlog.rejected, (state) => {
                state.status = "failed";
                state.authenticated = false;
                state.accessToken = null;
                state.user = null;
            });
    },
});

export const { logout, setHomeBlog } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { authApi } from "@/api/authApi";
import api from "@/api/axios";

interface AuthState {
    user: {
        name: string;
        handle: string;
        email: string;
        profileImg: string;
    } | null;
    status: "loading" | "authorized" | "logged_out" | "unauthorized" | "idle";
}

export const getAuthentication = createAsyncThunk(
    "/login/google",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(
                `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/user/meta`,
            );

            console.log(response);
            return response.data;
        } catch (e: unknown) {
            console.log(e);
            const error = e as {
                response?: { status?: number; data?: string };
            };
            return rejectWithValue({
                status: error?.response?.status ?? 0,
                details: error?.response?.data ?? "Unknown error",
            });
        }
    },
);

const inititialState: AuthState = {
    user: null,
    status: "idle",
};

const userDetailsSlice = createSlice({
    name: "userDetails",
    initialState: inititialState,
    reducers: {
        logout: (state) => {
            Object.assign(state, inititialState);
            state.status = "logged_out";
        },
        setAuthentication: (s, a) => {
            const user = a.payload;

            s.user = {
                name: user.name,
                handle: user.handle,
                email: user.email,
                profileImg: user.coverUrl,
            };
            s.status = "authorized";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAuthentication.fulfilled, (s, a) => {
                s.user = {
                    name: a.payload.name,
                    handle: a.payload.handle,
                    email: a.payload.email,
                    profileImg: a.payload.coverUrl,
                };
                s.status = "authorized";
                console.log(JSON.parse(JSON.stringify(s)));
            })
            .addCase(getAuthentication.rejected, (state) => {
                state.status = "unauthorized";
                state.user = null;
            });
    },
});

export const { logout, setAuthentication } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;

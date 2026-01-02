import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
    tokenExpiration: Number | null;
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

export const getAuthentication = createAsyncThunk(
    "/login/google",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post(
                "http://localhost:8080/api/v1/auth/refresh",
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
        } catch (e: any) {
            console.log(e);
            return rejectWithValue({
                status: e?.response?.status ?? 0,
                details: e?.response?.data ?? "Unknown error",
            });
        }
    },
);

const inititialState: AuthState = {
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
    initialState: inititialState,
    reducers: {
        logout: (state) => {
            Object.assign(state, inititialState);
        },
        setAuthentication: (s, a) => {
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
            .addCase(getAuthentication.pending, (s) => {
                s.status = "loading";
            })
            .addCase(getAuthentication.fulfilled, (s, a) => {
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
            .addCase(getAuthentication.rejected, (state) => {
                state.status = "failed";
                state.authenticated = false;
                state.accessToken = null;
                state.user = null;
            });
    },
});

export const { logout, setAuthentication } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { authApi } from "@/api/authApi";

interface AuthState {
    authenticated: boolean;
    accessToken: string | null;
    user: {
        name: string;
        email: string;
        profileImg: string;
    } | null;
    tokenExpiration: number | null;
    status:
        | "uninitialized"
        | "loading"
        | "authenticated"
        | "unauthenticated"
        | "logged_out";
}

interface JwtPayload {
    id: string;
    name: string;
    email: string;
    profile_url: string;
    accessToken: string;
    exp: number;
}

export const getAuthentication = createAsyncThunk(
    "/login/google",
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.post(
                `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/auth/refresh`,
                {
                    redirectUrl: "/",
                },
                {
                    withCredentials: true,
                },
            );
            const token = response.data.token;
            const data = jwtDecode<JwtPayload>(token);
            console.log("Data: ", data);
            return {
                token,
                data,
            };
        } catch (e: unknown) {
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
    authenticated: false,
    accessToken: null,
    user: {
        name: "",
        email: "",
        profileImg: "",
    },
    tokenExpiration: null,
    status: "loading",
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
            const { token, data } = a.payload;

            s.authenticated = true;
            s.accessToken = token;
            s.user = {
                name: data.name,
                email: data.email,
                profileImg: data.profile_url,
            };
            s.tokenExpiration = data.exp;
            s.status = "authenticated";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAuthentication.fulfilled, (s, a) => {
                s.authenticated = true;
                s.accessToken = a.payload.token;
                s.user = {
                    name: a.payload.data.name,
                    email: a.payload.data.email,
                    profileImg: a.payload.data.profile_url,
                };
                s.tokenExpiration = a.payload.data.exp;
                s.status = "authenticated";
                console.log(JSON.parse(JSON.stringify(s)));
            })
            .addCase(getAuthentication.rejected, (state) => {
                state.status = "unauthenticated";
                state.authenticated = false;
                state.accessToken = null;
                state.user = null;
            });
    },
});

export const { logout, setAuthentication } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;

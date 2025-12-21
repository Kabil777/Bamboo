import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface UserState {
  authenticated: boolean;
  id: string;
  name: string;
  email: string;
  profileImg: string;
  accessToken: string;
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
      const response = await axios.get("", {
        withCredentials: true,
      });
      const value = jwtDecode(response.data.token);

      return value;
    } catch (e) {
      console.log(e);
    }
  }
);

const inititialState: UserState = {
  authenticated: false,
  id: "",
  name: "",
  email: "",
  profileImg: "",
  accessToken: "",
  status: "idle",
};

const userDetails = createSlice({
  initialState: inititialState,
  name: "userDetails",
  reducers: {
    setUserDetails: (s, a) => {
      s.authenticated = a.payload.authenticated;
      s.id = a.payload.id;
      s.name = a.payload.name;
      s.email = a.payload.email;
      s.accessToken = a.payload.accessToken;
      s.profileImg = a.payload.profileImg ?? "";
    },
    logout: (s) => {
      s.authenticated = false;
      s.id = "";
      s.name = "";
      s.email = "";
      s.profileImg = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAuthentication.pending, (s) => {
        s.status = "loading";
      })
      .addCase(getAuthentication.fulfilled, (s, a :PayloadAction<JwtPayload>) => {
        s.authenticated = true;
        s.id = a.payload.id;
        s.name = a.payload.name;
        s.email = a.payload.email;
        s.accessToken = a.payload.accessToken;
        s.profileImg = a.payload.profileImg || "";
        s.status = "success";
      })
      .addCase(getAuthentication.rejected, (s) => {
        s.status = "failed";
      });
  },
});

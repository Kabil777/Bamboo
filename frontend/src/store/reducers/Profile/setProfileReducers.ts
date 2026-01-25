import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "@/api/axios";

import type { AllProfileBlog, Profile } from "@/types/Profile/profile-types";

interface SetProfileReducersState {
	designation: string;
	userProfile: {
		tags: string[];
		social: string[];
	};
}

const initialState: SetProfileReducersState = {
	designation: "",
	userProfile: {
		tags: [],
		social: [],
	},
};

export const getProfileDetials = createAsyncThunk<Profile, void>(
	"/api/getprofile",
	async (_, { rejectWithValue }) => {
		const URL = `${process.env.NEXT_PUBLIC_API_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/user/profile/me`;
		try {
			const response = await api.get<Profile>(URL);
			console.log(response.data);
			return response.data;
		} catch (e: any) {
			toast.error(e.message.status || "Failed to fetch user profile details");
			return rejectWithValue("Failed to fetch user profile details");
		}
	},
);

export const getAllProfileBlog= createAsyncThunk<AllProfileBlog, void>(
	"/api/getallprofileblog",
	async (_, { rejectWithValue }) => {
		const URL = `${process.env.NEXT_PUBLIC_API_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/user/profile/me/blogs`;
		try {
			const response = await api.get<AllProfileBlog>(URL);
			return response.data;
		} catch (e: any) {
			toast.error(e.message.status || "Failed to fetch user profile details");
			return rejectWithValue("Failed to fetch user profile details");
		}
	},
);

export const setProfileApi = createAsyncThunk<void, SetProfileReducersState>(
	"/api/setprofile",
	async (data) => {
		const URL = `${process.env.NEXT_PUBLIC_API_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/user/meta`;
		try {
			await api.post(URL, {
				designation: data.designation,
				userProfile: {
					tags: data.userProfile.tags,
					social: data.userProfile.social,
				},
			});
		} catch (e) {
			toast.warning("Failed to save user");
		} finally {
			toast.info("Form submitted successfully");
		}
	},
);

const setProfileReducers = createSlice({
	name: "setProfileReducers",
	initialState: initialState,
	reducers: {
		setAllProfile: (state, action: PayloadAction<SetProfileReducersState>) => {
			return action.payload;
		},
	},
});

export const { setAllProfile } = setProfileReducers.actions;

export default setProfileReducers.reducer;

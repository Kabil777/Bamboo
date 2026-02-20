import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "@/api/axios";
import {
	AllProfileBlog,
	AllProfileDocs,
	Profile,
} from "@/types/Profile/profile-types";

interface ProfileReducersState {
	profileData: Profile | null;
	blogs: AllProfileBlog | null;
	docs: AllProfileDocs | null;

	profileLoading: boolean;
	blogLoading: boolean;
	docsLoading: boolean;
	error: string | null;
}

const profileInitialState: ProfileReducersState = {
	profileData: null,
	blogs: null,
	docs: null,
	profileLoading: false,
	blogLoading: false,
	docsLoading: false,
	error: null,
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
			toast.error(
				e?.response?.data?.message || "Failed to fetch user profile details",
			);
			return rejectWithValue("Failed to fetch user profile details");
		}
	},
);

export const getUserProfileByHandle = createAsyncThunk<Profile, string>(
	"/api/getuserprofilebyhandle",
	async (handle: string, { rejectWithValue }) => {
		const URL = `${process.env.NEXT_PUBLIC_API_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/user/profile/${handle}`;
		try {
			const response = await api.get<Profile>(URL);
			console.log(response.data);
			return response.data;
		} catch (e: any) {
			// Don't show toast for 404 - let the layout handle it
			if (e?.response?.status !== 404) {
				toast.error(
					e?.response?.data?.message || "Failed to fetch user profile details",
				);
			}
			return rejectWithValue(
				e?.response?.status === 404
					? "User not found"
					: "Failed to fetch user profile details",
			);
		}
	},
);

export const getAllProfileBlog = createAsyncThunk<AllProfileBlog, void>(
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

export const getAllProfileBlogByHandle = createAsyncThunk<
	AllProfileBlog,
	string
>("/api/getallprofileblogbyhandle", async (handle, { rejectWithValue }) => {
	const URL = `${process.env.NEXT_PUBLIC_API_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/user/profile/${handle}/blogs`;
	try {
		const response = await api.get<AllProfileBlog>(URL);
		return response.data;
	} catch (e: any) {
		toast.error(e.message.status || "Failed to fetch user profile details");
		return rejectWithValue("Failed to fetch user profile details");
	}
});

export const getAllProfileDocs = createAsyncThunk<AllProfileDocs, void>(
	"/api/getallprofiledocs",
	async (_, { rejectWithValue }) => {
		const URL = `${process.env.NEXT_PUBLIC_API_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/user/profile/me/docs`;
		try {
			const response = await api.get<AllProfileDocs>(URL);
			return response.data;
		} catch (e: any) {
			toast.error(e.message.status || "Failed to fetch user docs");
			return rejectWithValue("Failed to fetch user docs");
		}
	},
);

export const getAllProfileDocsByHandle = createAsyncThunk<
	AllProfileDocs,
	string
>("/api/getallprofiledocsbyhandle", async (handle, { rejectWithValue }) => {
	const URL = `${process.env.NEXT_PUBLIC_API_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/user/profile/${handle}/docs`;
	try {
		const response = await api.get<AllProfileDocs>(URL);
		return response.data;
	} catch (e: any) {
		toast.error(e.message.status || "Failed to fetch user docs");
		return rejectWithValue("Failed to fetch user docs");
	}
});

const getProfile = createSlice({
	name: "getProfileReducers",
	initialState: profileInitialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getProfileDetials.pending, (state) => {
				state.profileLoading = true;
				state.error = null;
			})
			.addCase(getProfileDetials.fulfilled, (state, action) => {
				state.profileLoading = false;
				state.profileData = action.payload;
			})
			.addCase(getProfileDetials.rejected, (state, action) => {
				state.profileLoading = false;
				state.error = action.payload as string;
			});

		// ======================
		// GET USER PROFILE BY HANDLE
		// ======================
		builder
			.addCase(getUserProfileByHandle.pending, (state) => {
				state.profileLoading = true;
				state.error = null;
				state.profileData = null; // Clear old profile data
			})
			.addCase(getUserProfileByHandle.fulfilled, (state, action) => {
				state.profileLoading = false;
				state.profileData = action.payload;
			})
			.addCase(getUserProfileByHandle.rejected, (state, action) => {
				state.profileLoading = false;
				state.profileData = null; // Clear profile data on error
				state.error = action.payload as string;
			});

		// ======================
		// GET PROFILE BLOGS
		// ======================
		builder
			.addCase(getAllProfileBlog.pending, (state) => {
				state.blogLoading = true;
				state.error = null;
			})
			.addCase(getAllProfileBlog.fulfilled, (state, action) => {
				state.blogLoading = false;
				state.blogs = action.payload;
			})
			.addCase(getAllProfileBlog.rejected, (state, action) => {
				state.blogLoading = false;
				state.error = action.payload as string;
				state.blogs = { blogPagesDto: [], hasNext: false, cursor: null };
			});

		builder
			.addCase(getAllProfileBlogByHandle.pending, (state) => {
				state.blogLoading = true;
				state.error = null;
			})
			.addCase(getAllProfileBlogByHandle.fulfilled, (state, action) => {
				state.blogLoading = false;
				state.blogs = action.payload;
			})
			.addCase(getAllProfileBlogByHandle.rejected, (state, action) => {
				state.blogLoading = false;
				state.error = action.payload as string;
				state.blogs = { blogPagesDto: [], hasNext: false, cursor: null };
			});

		// ======================
		// GET PROFILE DOCS
		// ======================
		builder
			.addCase(getAllProfileDocs.pending, (state) => {
				state.docsLoading = true;
				state.error = null;
			})
			.addCase(getAllProfileDocs.fulfilled, (state, action) => {
				state.docsLoading = false;
				state.docs = action.payload;
			})
			.addCase(getAllProfileDocs.rejected, (state, action) => {
				state.docsLoading = false;
				state.error = action.payload as string;
				state.docs = { docs: [], hasNext: false, cursor: null };
			});

		builder
			.addCase(getAllProfileDocsByHandle.pending, (state) => {
				state.docsLoading = true;
				state.error = null;
			})
			.addCase(getAllProfileDocsByHandle.fulfilled, (state, action) => {
				state.docsLoading = false;
				state.docs = action.payload;
			})
			.addCase(getAllProfileDocsByHandle.rejected, (state, action) => {
				state.docsLoading = false;
				state.error = action.payload as string;
				state.docs = { docs: [], hasNext: false, cursor: null };
			});
	},
});

export default getProfile.reducer;

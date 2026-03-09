import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "@/api/axios";
import {
	AllProfileBlog,
	AllProfileDocs,
	Profile,
} from "@/types/Profile/profile-types";

function getApiErrorMessage(
	e: any,
	fallback: string,
	options?: { suppress404Toast?: boolean },
) {
	const status = e?.response?.status;
	const message =
		e?.response?.data?.message ||
		e?.response?.data?.error ||
		e?.message ||
		fallback;

	if (!(options?.suppress404Toast && status === 404)) {
		toast.error(message);
	}

	return {
		status,
		message,
	};
}

interface ProfileReducersState {
	profileData: Profile | null;
	blogs: AllProfileBlog | null;
	docs: AllProfileDocs | null;

	profileLoading: boolean;
	blogLoading: boolean;
	docsLoading: boolean;
	profileError: string | null;
	blogError: string | null;
	docsError: string | null;
}

const profileInitialState: ProfileReducersState = {
	profileData: null,
	blogs: null,
	docs: null,
	profileLoading: false,
	blogLoading: false,
	docsLoading: false,
	profileError: null,
	blogError: null,
	docsError: null,
};

export const getProfileDetials = createAsyncThunk<Profile, void>(
	"/api/getprofile",
	async (_, { rejectWithValue }) => {
		const URL = `${process.env.NEXT_PUBLIC_API_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/user/profile/me`;
		try {
			const response = await api.get<Profile>(URL);
			return response.data;
		} catch (e: any) {
			const { message } = getApiErrorMessage(
				e,
				"Failed to fetch user profile details",
			);
			return rejectWithValue(message);
		}
	},
);

export const getUserProfileByHandle = createAsyncThunk<Profile, string>(
	"/api/getuserprofilebyhandle",
	async (handle: string, { rejectWithValue }) => {
		const URL = `${process.env.NEXT_PUBLIC_API_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/user/profile/${handle}`;
		try {
			const response = await api.get<Profile>(URL);
			return response.data;
		} catch (e: any) {
			const { status, message } = getApiErrorMessage(
				e,
				"Failed to fetch user profile details",
				{ suppress404Toast: true },
			);
			return rejectWithValue(
				status === 404 ? "User not found" : message,
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
			const { message } = getApiErrorMessage(
				e,
				"Failed to fetch user profile blogs",
			);
			return rejectWithValue(message);
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
		const { message } = getApiErrorMessage(
			e,
			"Failed to fetch user profile blogs",
		);
		return rejectWithValue(message);
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
			const { message } = getApiErrorMessage(
				e,
				"Failed to fetch user docs",
			);
			return rejectWithValue(message);
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
		const { message } = getApiErrorMessage(
			e,
			"Failed to fetch user docs",
		);
		return rejectWithValue(message);
	}
});

const getProfile = createSlice({
	name: "getProfileReducers",
	initialState: profileInitialState,
	reducers: {
		resetProfileView: (state) => {
			state.profileData = null;
			state.profileError = null;
			state.profileLoading = false;
		},
		resetProfileCollections: (state) => {
			state.blogs = null;
			state.docs = null;
			state.blogError = null;
			state.docsError = null;
			state.blogLoading = false;
			state.docsLoading = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getProfileDetials.pending, (state) => {
				state.profileLoading = true;
				state.profileError = null;
			})
			.addCase(getProfileDetials.fulfilled, (state, action) => {
				state.profileLoading = false;
				state.profileData = action.payload;
			})
			.addCase(getProfileDetials.rejected, (state, action) => {
				state.profileLoading = false;
				state.profileError = action.payload as string;
			});

		// ======================
		// GET USER PROFILE BY HANDLE
		// ======================
		builder
			.addCase(getUserProfileByHandle.pending, (state) => {
				state.profileLoading = true;
				state.profileError = null;
				state.profileData = null; // Clear old profile data
			})
			.addCase(getUserProfileByHandle.fulfilled, (state, action) => {
				state.profileLoading = false;
				state.profileData = action.payload;
			})
			.addCase(getUserProfileByHandle.rejected, (state, action) => {
				state.profileLoading = false;
				state.profileData = null; // Clear profile data on error
				state.profileError = action.payload as string;
			});

		// ======================
		// GET PROFILE BLOGS
		// ======================
		builder
			.addCase(getAllProfileBlog.pending, (state) => {
				state.blogLoading = true;
				state.blogError = null;
			})
			.addCase(getAllProfileBlog.fulfilled, (state, action) => {
				state.blogLoading = false;
				state.blogs = action.payload;
			})
			.addCase(getAllProfileBlog.rejected, (state, action) => {
				state.blogLoading = false;
				state.blogError = action.payload as string;
				state.blogs = { items: [], hasNext: false, cursor: null };
			});

		builder
			.addCase(getAllProfileBlogByHandle.pending, (state) => {
				state.blogLoading = true;
				state.blogError = null;
			})
			.addCase(getAllProfileBlogByHandle.fulfilled, (state, action) => {
				state.blogLoading = false;
				state.blogs = action.payload;
			})
			.addCase(getAllProfileBlogByHandle.rejected, (state, action) => {
				state.blogLoading = false;
				state.blogError = action.payload as string;
				state.blogs = { items: [], hasNext: false, cursor: null };
			});

		// ======================
		// GET PROFILE DOCS
		// ======================
		builder
			.addCase(getAllProfileDocs.pending, (state) => {
				state.docsLoading = true;
				state.docsError = null;
			})
			.addCase(getAllProfileDocs.fulfilled, (state, action) => {
				state.docsLoading = false;
				state.docs = action.payload;
			})
			.addCase(getAllProfileDocs.rejected, (state, action) => {
				state.docsLoading = false;
				state.docsError = action.payload as string;
				state.docs = { items: [], hasNext: false, cursor: null };
			});

		builder
			.addCase(getAllProfileDocsByHandle.pending, (state) => {
				state.docsLoading = true;
				state.docsError = null;
			})
			.addCase(getAllProfileDocsByHandle.fulfilled, (state, action) => {
				state.docsLoading = false;
				state.docs = action.payload;
			})
			.addCase(getAllProfileDocsByHandle.rejected, (state, action) => {
				state.docsLoading = false;
				state.docsError = action.payload as string;
				state.docs = { items: [], hasNext: false, cursor: null };
			});
	},
});

export const { resetProfileCollections, resetProfileView } = getProfile.actions;
export default getProfile.reducer;

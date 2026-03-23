import type { userProfile, userUpdatePayload } from "@/types/user/user-base";
import api from "./axios";

const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;

export const getUserProfile = async (): Promise<userProfile> => {
    const response = await api.get(`${API_VERSION}/user/profile/me`);
    return response.data;
};

export const updateUserProfile = async (
    data: userUpdatePayload,
): Promise<userProfile> => {
    const response = await api.put(`${API_VERSION}/user`, data);
    return response.data;
};

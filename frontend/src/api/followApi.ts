import api from "./axios";

const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "/api/v1";

export const followUser = async (handle: string) => {
    const response = await api.post(`${API_VERSION}/users/handle/${handle}/follow`);
    return response.data;
};

export const unfollowUser = async (handle: string) => {
    const response = await api.delete(`${API_VERSION}/users/handle/${handle}/follow`);
    return response.data;
};

export const getFollowersByHandle = async (handle: string) => {
    const response = await api.get(`${API_VERSION}/users/${handle}/followers`);
    return response.data;
};

export const getFollowingByHandle = async (handle: string) => {
    const response = await api.get(`${API_VERSION}/users/${handle}/following`);
    return response.data;
};

export const getCountsByHandle = async (handle: string, requesterId?: string) => {
    const config = requesterId ? { headers: { "X-User-Id": requesterId } } : {};
    const response = await api.get(`${API_VERSION}/users/${handle}/counts`, config);
    return response.data;
};

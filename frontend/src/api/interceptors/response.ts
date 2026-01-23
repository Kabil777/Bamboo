import store from "@/store/store";
import { authApi } from "../authApi";
import api from "../axios";
import { logout } from "@/store/reducers/AuthReducers";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
    failedQueue.forEach(({ resolve, reject }) => {
        error ? reject(error) : resolve();
    });
    failedQueue = [];
};

export const responseInterceptor = async (error: any) => {
    const originalRequest = error.config;

    if (originalRequest.url?.includes("/auth/refresh")) {
        store.dispatch(logout());
        return Promise.reject(error);
    }

    if (
        (error.response?.status === 401 || error.response?.status === 403) &&
        !originalRequest._retry
    ) {
        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => api(originalRequest));
        }

        isRefreshing = true;

        try {
            const URL = `${process.env.NEXT_PUBLIC_API_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/auth`;
            await authApi.post(URL + "/refresh");

            processQueue(null);
            return api(originalRequest);
        } catch (err) {
            processQueue(err);
            store.dispatch(logout());
            console.log(err);
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }

    return Promise.reject(error);
};

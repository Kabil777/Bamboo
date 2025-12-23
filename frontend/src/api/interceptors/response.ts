import store from "@/store/store";
import api from "../axios";
import { logout, setAuthentication } from "@/store/reducers/AuthReducers";
import { jwtDecode } from "jwt-decode";

const responseInterceptor = async (error: any) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            const res = await api.post("/refresh");
            const token = res.data.token;
            const decoded = jwtDecode(token);

            store.dispatch(
                setAuthentication({
                    token,
                    data: decoded,
                }),
            );

            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

            return api(originalRequest);
        } catch (e) {
            store.dispatch(logout());
        }
    }
    return Promise.reject(error);
};

export default responseInterceptor;

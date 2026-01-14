import { jwtDecode } from "jwt-decode";
import { authApi } from "../authApi";
import api from "../axios";
import store from "@/store/store";
import { setAuthentication } from "@/store/reducers/AuthReducers";
import { logout } from "@/store/reducers/AuthReducers";

let isRefreshing: boolean = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else promise.resolve(token);
  });
  failedQueue = [];
};

export const responseInterceptor = async (error: any) => {
  const originalRequest = error.config;

  if (originalRequest.url.includes("/auth/refresh")) {
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
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }
    isRefreshing = true;

    try {
      const res = await authApi.post("/refresh");
      const accessToken = res.data.accessToken;

      const decoded = jwtDecode(accessToken);

      store.dispatch(
        setAuthentication({
          token: accessToken,
          data: decoded,
        }),
      );

      processQueue(null, accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (error) {
      processQueue(error);
      store.dispatch(logout());
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};

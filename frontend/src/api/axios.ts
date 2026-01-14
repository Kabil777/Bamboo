import axios from "axios";
import setupInterceptors from "./interceptors";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_SERVER_URL,
  withCredentials: true,
});
setupInterceptors();

export default api;

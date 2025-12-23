import axios from "axios";

const api = axios.create({
    baseURL: process.env.AUTH_URL,
    withCredentials: true,
});

export default api;

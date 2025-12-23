import api from "../axios";
import { requestInterceptor } from "./request";
import responseInterceptor from "./response";

const setupInterceptors = () => {
    api.interceptors.request.use(requestInterceptor);
    api.interceptors.response.use((res) => res, responseInterceptor);
};

export default setupInterceptors;

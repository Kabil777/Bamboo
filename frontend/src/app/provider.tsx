import setupInterceptors from "@/api/interceptors";
import { useEffect } from "react";

export const Provider = () => {
    useEffect(() => {
        setupInterceptors();
    }, []);
    return null;
};

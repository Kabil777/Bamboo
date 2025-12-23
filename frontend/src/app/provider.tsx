import setupInterceptors from "@/api/interceptors";
import { useEffect } from "react";

export const provider = () => {
    useEffect(() => {
        setupInterceptors();
    }, []);
    return <></>;
};

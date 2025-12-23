"use client";

import store, { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { authenticated, status } = useSelector(
        (state: RootState) => state.userReducer,
    );

    useEffect(() => {
        if (status === "failed") {
            router.replace("/login");
        }
    }, [status, router]);

    if (status === "idle" || status === "loading") {
        return null;
    }

    if (!authenticated) return null;
    return <>{children}</>;
};

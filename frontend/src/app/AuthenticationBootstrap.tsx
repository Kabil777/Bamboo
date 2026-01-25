"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { getAuthentication } from "@/store/reducers/AuthReducers";

export function AuthBootstrap() {
    const dispatch = useAppDispatch();
    const { status } = useAppState((s) => s.userReducer);

    useEffect(() => {
        if (status === "idle") {
            dispatch(getAuthentication());
        }
    }, [status, dispatch]);

    return null;
}

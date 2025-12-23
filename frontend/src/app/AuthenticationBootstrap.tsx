"use client";

import { useAppDispatch } from "@/hooks/ReduxHooks";
import { getAuthentication } from "@/store/reducers/AuthReducers";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AuthBootstrap() {
    const dispatch = useAppDispatch();
    const status = useSelector((state: RootState) => state.userReducer.status);
    useEffect(() => {
        if (status === "idle") {
            dispatch(getAuthentication());
        }
    }, [dispatch]);

    return null;
}

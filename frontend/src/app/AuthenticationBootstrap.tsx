"use client";

import { useAppDispatch } from "@/hooks/ReduxHooks";
import { getAuthentication } from "@/store/reducers/AuthReducers";
import { useEffect, useRef } from "react";

export default function AuthBootstrap() {
    const dispatch = useAppDispatch();
    const ran = useRef(false);
    useEffect(() => {
        if (ran.current) return;
        ran.current = true;
        dispatch(getAuthentication());
    }, [dispatch]);

    return null;
}

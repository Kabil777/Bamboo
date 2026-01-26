"use client";

import { NavBar } from "@/components/ui";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { getAuthentication } from "@/store/reducers/AuthReducers";
import { useEffect, useRef } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {   
        const dispatch = useAppDispatch();
        const authFetched = useRef(false);
        const { status } = useAppState((s) => s.userReducer);

        useEffect(() => {
          if (!authFetched.current && status === "idle") {
            authFetched.current = true;
            dispatch(getAuthentication());
          }
        }, [status, dispatch, authFetched]);
    return (
        <>
            <NavBar />
            {children}
        </>
    );
}

"use client";
import { authApi } from "@/api/authApi";
import { useAppDispatch } from "@/hooks/ReduxHooks";
import { logout } from "@/store/reducers/AuthReducers";
import { useRouter } from "next/navigation";

export function useLogout() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    return async function handleLogout() {
        try {
            await authApi.post(
                process.env.NEXT_PUBLIC_AUTH_SERVER_URL + "/auth/logout",
                {},
                { withCredentials: true },
            );

            dispatch(logout());
            router.replace("/login");
        } catch (e) {
            console.error("Logout failed", e);
        }
    };
}

import api from "@/api/axios";
import { useAppDispatch } from "@/hooks/ReduxHooks";
import { logout } from "@/store/reducers/AuthReducers";
import { useRouter } from "next/navigation";

export function useLogout() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    return async function handleLogout() {
        try {
            await api.post(
                "http://localhost:8080/api/v1/auth/logout",
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

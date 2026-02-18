import { authApi } from "@/api/authApi";

let inflightRefresh: Promise<void> | null = null;

function isTokenExpiredSignal(code?: number, reason?: string) {
    return code === 4401 || reason === "TOKEN_EXPIRED";
}

export function shouldRefreshWsAuth(code?: number, reason?: string) {
    return isTokenExpiredSignal(code, reason);
}

export function refreshSessionForCollab() {
    if (!inflightRefresh) {
        const apiServerUrl = process.env.NEXT_PUBLIC_API_SERVER_URL || "";
        const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "";
        const url = `${apiServerUrl}${apiVersion}/auth/refresh`;

        inflightRefresh = authApi.post(url).then(() => undefined);
        inflightRefresh.finally(() => {
            inflightRefresh = null;
        });
    }

    return inflightRefresh;
}

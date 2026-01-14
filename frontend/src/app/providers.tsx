"use client";

import { Provider } from "react-redux";
import store from "@/store/store";
import { ThemeProvider } from "@/components/theme-provider";
import NextTopLoader from "nextjs-toploader";
import AuthBootstrap from "./AuthenticationBootstrap";
import { Toaster } from "@/components/shadcnUI/sonner";
import setupInterceptors from "@/api/interceptors";
import api from "@/api/axios";

setupInterceptors(api);
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthBootstrap />
            <ThemeProvider attribute="class" defaultTheme="light">
                <NextTopLoader height={2} showSpinner />
                <Toaster />
                {children}
            </ThemeProvider>
        </Provider>
    );
}

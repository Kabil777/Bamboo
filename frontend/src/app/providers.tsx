"use client";

import { Provider } from "react-redux";
import store from "@/store/store";
import { ThemeProvider } from "@/components/theme-provider";
import NextTopLoader from "nextjs-toploader";
import AuthBootstrap from "./AuthenticationBootstrap";
import setupInterceptors from "@/api/interceptors";
import api from "@/api/axios";
import { Toaster } from "@/components/shadcnUI/sonner";

setupInterceptors(api);
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ThemeProvider attribute="class" defaultTheme="light">
                <NextTopLoader
                    color="linear-gradient(0.25turn, var(--background), var(--foreground))"
                    height={2}
                    showSpinner={true}
                />
                <Toaster  />
                {children}
            </ThemeProvider>
        </Provider>
    );
}

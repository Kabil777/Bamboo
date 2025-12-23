// "use client";

import type { Metadata } from "next";
import { NavBar } from "@/components/ui";
import { ProtectedRoute } from "./ProtectedRoute";

export const metadata: Metadata = {
    title: "Bamboo",
    description: "Bamboo app help getting things done",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ProtectedRoute>
            <NavBar />
            {children}
        </ProtectedRoute>
    );
}

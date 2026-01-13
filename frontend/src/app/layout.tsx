import "@/styles/globals.css";
import "highlight.js/styles/magula.min.css";

import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "sonner";
const inter = Inter({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-inter",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <html lang="en" suppressHydrationWarning>
                <head />
                <body className={inter.className}>
                    <Providers>{children}</Providers>
                    <Toaster />
                </body>
            </html>
        </>
    );
}

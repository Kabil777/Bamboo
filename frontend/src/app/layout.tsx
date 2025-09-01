"use client";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/shadcnUI/sonner";
import NextTopLoader from "nextjs-toploader";
import { Provider } from "react-redux";
import store from "../store/store";
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
      <Provider store={store}>
        <html lang="en" suppressHydrationWarning>
          <head />
          <body className={inter.className}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <NextTopLoader
                color="linear-gradient(0.25turn, var(--background), var(--foreground))"
                height={2}
                showSpinner={true}
              />
              {children}
            </ThemeProvider>
            <Toaster />
          </body>
        </html>
      </Provider>
    </>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import ReduxProvider from "@/lib/providers/ReduxProvider";
import { ThemeProvider } from 'next-themes';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Portfolio",
    description: "Portfolio app",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`bg-l-background text-neutral-900 dark:bg-d-background dark:text-neutral-100 ${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <ReduxProvider>
                        <main className="flex-grow">{children}</main>
                    </ReduxProvider>
                </ThemeProvider>
            </body>
        </html>
    );
};
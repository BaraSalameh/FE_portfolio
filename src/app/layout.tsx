import type { Metadata } from "next";
import "@/styles/globals.css";
import ReduxProvider from "@/lib/providers/ReduxProvider";
import { ThemeProvider } from 'next-themes';
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
    title: {
        template: '%s | Folio',
        default: 'Folio'
    },
    description: "Build and share a polished portfolio that connects your experience, skills, and projects in one professional story."
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
            <body className={`bg-light-background dark:bg-dark-background ${inter.className} antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <ReduxProvider>
                        {children}
                    </ReduxProvider>
                </ThemeProvider>
            </body>
        </html>
    );
};

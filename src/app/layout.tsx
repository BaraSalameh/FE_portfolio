import type { Metadata } from "next";
import "@/styles/globals.css";
import ReduxProvider from "@/lib/providers/ReduxProvider";
import { ThemeProvider } from 'next-themes';
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
    title: {
        template: '%s | Portfolio',
        default: 'Portfolio'
    },
    description: "The official Portfolio app for showcasing profissional expierence"
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="en" suppressHydrationWarning>
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
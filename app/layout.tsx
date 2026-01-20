import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "Vigilance - Narrative Security Platform",
    description: "Treat Narrative Security as a cybersecurity threat. Detect and contain narrative breaches with TTD < 5ms.",
    keywords: ["narrative security", "misinformation", "AI safety", "hallucination detection", "cybersecurity"],
    openGraph: {
        title: "Vigilance - Narrative Security Platform",
        description: "Stop hallucination velocity. Detect, contain, and remediate narrative breaches.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${inter.variable} ${GeistMono.variable} font-sans`}>
                {children}
            </body>
        </html>
    );
}

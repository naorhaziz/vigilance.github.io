import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                vigilance: {
                    base: '#1F2A38', // Ebony Clay - Global Background
                    surface: '#2D364C', // Light Clay - Cards/Modals
                    primary: '#00D891', // Caribbean Green - Success/Safe/Action
                    secondary: '#97F7E2', // Ice Cold - Accents/Links
                    danger: '#FF4D4D', // Cherry Fizz - Threats/Hallucinations
                    warning: '#FFA500', // Bubbly Orange - Warnings
                    muted: '#94A3B8', // Slate - Secondary Text
                }
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'], // UI Text
                mono: ['var(--font-geist-mono)', 'monospace'], // Data/Metrics
            },
            backgroundImage: {
                'glass': 'linear-gradient(145deg, rgba(45, 54, 76, 0.4) 0%, rgba(45, 54, 76, 0.1) 100%)',
                'mint-glow': 'radial-gradient(circle at center, rgba(0, 216, 145, 0.15) 0%, transparent 70%)',
            }
        },
    },
    plugins: [],
};

export default config;

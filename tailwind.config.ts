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
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Cultural Colors
                turkuaz: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                    700: '#007E80', // Deep Cultural Turquoise
                    800: '#115e59',
                    900: '#134e4a',
                    950: '#042f2e', // Very dark deep teal
                },
                bakir: { // Copper
                    50: '#fdf8f6',
                    100: '#f2e8e5',
                    200: '#eaddd7',
                    300: '#e0cec7',
                    400: '#d2bab0',
                    500: '#B87333', // Warm Copper
                    600: '#9a5b24',
                    700: '#7c461b',
                    800: '#5e330f',
                    900: '#45230a',
                    950: '#2a1205', // Very dark copper
                },
                altin: {
                    100: '#fff9c4',
                    500: '#fbc02d',
                },
                cinivit: { // Tile Blue
                    500: '#1a237e',
                }
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                display: ['var(--font-outfit)', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
export default config;

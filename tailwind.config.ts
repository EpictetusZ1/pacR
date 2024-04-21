import type { Config } from "tailwindcss";

const config: Config = {
    // mode: "jit",
    // purge: [
    //   "./public/**/*.html",
    //   "./src/**/*.{js,jsx,ts,tsx,vue}",
    // ],
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors:{
                white: "#FFF",
                black: "#1B1B1B",
                charcoal: "#3a4454",
                marian: "#2b4570",
                aq: "#a4f9c8",
                atomic: {
                    300: "#ff5f7c",
                    400: "#FF4D6D",
                    500: "#e64562",
                    600: "#b3364c",
                },
                darkCyan: {
                    400: "#00a6a6",
                    500:  "#048a81",
                    600: "#047c74",
                },
                roseBonbon: {
                    400: "#f6a2b7",
                    500: "#de4e9f",
                    600: "#c53c8f",
                },
                charts: {
                    green: "#72F67F",
                    purple: "#7F72F6",
                    red: "#F67F72",
                }
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
        fontFamily: {
            inter: ["Inter", "sans-serif"]
        },
    },
    plugins: [],
};
export default config;

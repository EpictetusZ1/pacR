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
                dBlue: "#3c2edd",
                misty: "#f5dddd",
                orangeWheel: "#f77f00",
                darkCyan: "#048a81",
                roseBonbon: "#de4e9f",
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

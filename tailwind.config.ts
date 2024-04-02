import type { Config } from "tailwindcss";

const config: Config = {
    // mode: "jit",
    // purge: [
    //   './public/**/*.html',
    //   './src/**/*.{js,jsx,ts,tsx,vue}',
    // ],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        colors:{
            white: "#FFF",
            black: "#1B1B1B",
            taupe: "#7e6c6cff",
            lightRed: "#f87575ff",
            melon: "#ffa9a3ff",
            soft: "#b9e6ffff",
            cornflower: "#5c95ffff",
            charts: {
                green: "#72F67F",
                purple: "#7F72F6",
                red: "#F67F72",
            }
        },
        fontFamily: {
            inter: ["Inter", "sans-serif"]
        },
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;

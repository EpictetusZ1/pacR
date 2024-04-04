import type { Config } from "tailwindcss";

const config: Config = {
    mode: "jit",
    purge: [
      './public/**/*.html',
      './src/**/*.{js,jsx,ts,tsx,vue}',
    ],
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
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

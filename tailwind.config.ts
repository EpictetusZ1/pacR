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
    extend: {
      backgroundImage: {
        // background: #FFEFBA;  /* fallback for old browsers */
        // background: -webkit-linear-gradient(to right, #FFFFFF, #FFEFBA);  /* Chrome 10-25, Safari 5.1-6 */
        // background: linear-gradient(to right, #FFFFFF, #FFEFBA); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        "gradient-to-r": "linear-gradient(to right, #FFFFFF, #FFEFBA)",
      },
    },
  },
  plugins: [],
};
export default config;

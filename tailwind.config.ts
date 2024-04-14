import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      textColor: {
        primary: "rgb(var(--background-color-900) / <alpha-value>)",
        secondary: "rgb(var(--background-color-600) / <alpha-value>)",
      },
      backgroundColor: {
        surface: "rgb(var(--background-color-50) / <alpha-value>)",
        surface1: "rgb(var(--background-color-100) / <alpha-value>)",
        surface2: "rgb(var(--background-color-200) / <alpha-value>)",
        surface3: "rgb(var(--background-color-300) / <alpha-value>)",
        surface4: "rgb(var(--background-color-400) / <alpha-value>)",
        surface5: "rgb(var(--background-color-500) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
export default config;

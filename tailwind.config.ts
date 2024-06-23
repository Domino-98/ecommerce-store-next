import type { Config } from "tailwindcss";
const plugin = require('tailwindcss/plugin');

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
        "horizontal-rule": "linear-gradient(90deg, transparent, rgba(0, 0, 0, .1), transparent)"
      },
      textColor: {
        primary: "rgb(var(--background-color-900) / <alpha-value>)",
        secondary: "rgb(var(--background-color-600) / <alpha-value>)",
      },
      backgroundColor: {
        surface: "rgb(var(--background-color-0) / <alpha-value>)",
        surface1: "rgb(var(--background-color-50) / <alpha-value>)",
        surface2: "rgb(var(--background-color-100) / <alpha-value>)",
        surface3: "rgb(var(--background-color-200) / <alpha-value>)",
        surface4: "rgb(var(--background-color-300) / <alpha-value>)",
        surface5: "rgb(var(--background-color-400) / <alpha-value>)",
        surface6: "rgb(var(--background-color-500) / <alpha-value>)",
      },
      boxShadow: {
        primary: "0 4px 6px -1px rgb(var(--background-color-200) / 20%), 0 2px 4px -1px rgb(var(--background-color-200) / 10%)",
        shadowBorder: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px"
      }
    },
  },
  plugins: [
    plugin(function ({ addVariant }: { addVariant: Function }) {
      addVariant('not-first', '&:not(:first-child)')
      addVariant('not-last', '&:not(:last-child)')
    })
  ],
  future: {
    hoverOnlyWhenSupported: true
  }
};
export default config;

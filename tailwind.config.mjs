/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { sans: ["Poppins", "sans-serif"] },
    },
  },
  plugins: [],

  theme: {
    extend: {
      minHeight: {
        "screen-navbar": "calc(100vh - 64px)",
      },
    },
  },
};

import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        body: "#0B0B0B",
        text: "#111827",
        muted: "#6B7280",
        header: "#111111",
        banner: "#FEF3C7",
        btn: "#222222"
      },
      borderRadius: { "8": "8px" },
      boxShadow: { soft: "0 2px 8px rgba(0,0,0,.12)" }
    }
  },
  plugins: []
};
export default config;

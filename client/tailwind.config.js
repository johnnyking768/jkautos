/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        jk: {
          bg: "#080808",
          panel: "#111111",
          elevated: "#1A1A1A",
          red: "#CC0000",
          redLight: "#FF1A1A",
          silver: "#C0C0C0",
          gold: "#D4AF37",
          text: "#FFFFFF",
          secondary: "#A0A0A0",
          muted: "#555555",
          border: "#222222",
          success: "#00C851",
          warning: "#FFB300",
          error: "#FF3D57",
        },
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        body: ["Inter", "sans-serif"],
        data: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        speedLines: {
          "0%": { transform: "translateX(-30%) skewX(-18deg)" },
          "100%": { transform: "translateX(30%) skewX(-18deg)" },
        },
        pulseRed: {
          "0%, 100%": { boxShadow: "0 0 0 rgba(204,0,0,0)" },
          "50%": { boxShadow: "0 0 30px rgba(204,0,0,.45)" },
        },
      },
      animation: {
        fadeUp: "fadeUp .5s ease both",
        speedLines: "speedLines 8s linear infinite",
        pulseRed: "pulseRed 2.4s ease infinite",
      },
    },
  },
  plugins: [],
};

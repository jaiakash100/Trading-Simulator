/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aegis: {
          bg: "#080A11",
          card: "rgba(18, 22, 34, 0.75)",
          border: "rgba(255, 255, 255, 0.08)",
          crimson: "#FF1E56",
          cyan: "#00F0FF",
          emerald: "#00FF87",
          silver: "#E2E8F0",
          slate: "#94A3B8",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'crimson-glow': '0 0 25px rgba(255, 30, 86, 0.4)',
        'cyan-glow': '0 0 25px rgba(0, 240, 255, 0.4)',
        'emerald-glow': '0 0 25px rgba(0, 255, 135, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}

import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        node: {
          ai: "hsl(var(--node-ai))",
          action: "hsl(var(--node-action))",
          api: "hsl(var(--node-api))",
          input: "hsl(var(--node-input))",
          condition: "hsl(var(--node-condition))",
          email: "hsl(var(--node-email))",
          webhook: "hsl(var(--node-webhook))",
          db: "hsl(var(--node-db))",
          js: "hsl(var(--node-js))",
          text: "hsl(var(--node-text))",
          button: "hsl(var(--node-button))",
          variable: "hsl(var(--node-variable))",
          timer: "hsl(var(--node-timer))",
          random: "hsl(var(--node-random))",
          loop: "hsl(var(--node-loop))",
          gallery: "hsl(var(--node-gallery))",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;

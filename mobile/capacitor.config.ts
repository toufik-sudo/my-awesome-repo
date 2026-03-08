import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.ba76e28e266e488881482cbf0bffc460",
  appName: "AI Agent Builder",
  webDir: "../dist",
  server: {
    // Live reload from sandbox (remove for production)
    url: "https://ba76e28e-266e-4888-8148-2cbf0bffc460.lovableproject.com?forceHideBadge=true",
    cleartext: true,
  },
};

export default config;

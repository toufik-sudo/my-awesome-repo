import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/**
 * Bundle configuration for embedding this app as an iframe or standalone widget.
 * 
 * Build: npx vite build --config vite.bundle.config.ts
 * Output: dist-bundle/
 * 
 * Usage as iframe:
 *   <iframe src="/dist-bundle/index.html" width="100%" height="600"></iframe>
 * 
 * The bundle is self-contained with all assets inlined or co-located.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "./", // relative paths for portable embedding
  build: {
    outDir: "dist-bundle",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Single JS + CSS file for easy embedding
        manualChunks: undefined,
        entryFileNames: "agent-builder.js",
        chunkFileNames: "agent-builder-[hash].js",
        assetFileNames: "agent-builder.[ext]",
      },
    },
  },
});

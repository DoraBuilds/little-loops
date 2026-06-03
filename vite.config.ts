import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const appVersion =
  process.env.GITHUB_SHA?.slice(0, 7) ??
  process.env.npm_package_version ??
  `dev-${Date.now()}`;

const versionManifestPlugin = () => ({
  name: "little-loops-version-manifest",
  generateBundle() {
    this.emitFile({
      type: "asset",
      fileName: "version.json",
      source: JSON.stringify({ version: appVersion }, null, 2),
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: process.env.GITHUB_ACTIONS ? "/little-loops/" : "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), versionManifestPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

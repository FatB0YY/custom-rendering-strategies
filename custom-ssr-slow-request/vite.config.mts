import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    manifest: true,
    minify: false,
    cssCodeSplit: false
  }
});

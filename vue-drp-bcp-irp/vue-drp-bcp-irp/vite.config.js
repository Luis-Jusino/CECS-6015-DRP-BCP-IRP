import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
export default defineConfig({
  plugins: [vue()],
  base: "luis-jusino.github.io", // <-- add this line for project sites
});

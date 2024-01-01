import { defineConfig } from "vite";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: "prompt",
  manifest: {
    name: "Cityvet",
    short_name: "Cityvet",
    start_url: ".",
    display: "standalone",
    background_color: "#fff",
    description:
      "Cityvet Livestock Dispersal Program Livestock Management System.",
    icons: [
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
});

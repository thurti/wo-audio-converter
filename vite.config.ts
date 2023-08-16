import { defineConfig, loadEnv } from "vite";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { TrackFileProgressPlugin } from "./src/lib/workbox-track-file-progress";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return defineConfig({
    base: process.env.VITE_BASE_URL,
    optimizeDeps: {
      exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
    },
    plugins: [
      svelte({
        preprocess: [vitePreprocess()],
      }),
      {
        name: "configure-response-headers",
        configureServer: (server) => {
          server.middlewares.use((_req, res, next) => {
            res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
            res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
            next();
          });
        },
      },
      {
        name: "resolve-package-version",
        config: (_, env) => {
          if (env) {
            const key = "import.meta.env.PACKAGE_VERSION";
            const val = JSON.stringify(process.env.npm_package_version);
            return { define: { [key]: val } };
          }
        },
      },
      VitePWA({
        registerType: "prompt",
        strategies: "generateSW",
        devOptions: {
          enabled: false,
          type: "module",
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,woff2}"],
          globIgnores: ["**/lib/ffmpeg/**"],
          maximumFileSizeToCacheInBytes: 30 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: /lib\/ffmpeg\/.*$/,
              handler: "CacheFirst",
              options: {
                cacheName: `wo-ffmpeg-${process.env.VITE_FFMPEG_VERSION}`,
                plugins: [new TrackFileProgressPlugin()],
              },
            },
          ],
        },
        manifest: {
          name: "Audio File Converter",
          short_name: "Audio Converter",
          description: "Badge convert your audio files.",
          start_url: "./index.html",
          display: "standalone",
          icons: [
            {
              src:
                process.env.VITE_BASE_URL + "icons/android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src:
                process.env.VITE_BASE_URL + "icons/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
          // theme_color: "#059669",
          background_color: "#3f3f46",
          screenshots: [
            {
              src: "screenshot.png",
              sizes: "970x837",
              type: "image/png",
              platform: "wide",
              label: "Homescreen of Audio File Converter",
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    esbuild: {
      drop: ["console", "debugger"],
    },
    preview: {
      headers: {
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin",
      },
    },
  });
};

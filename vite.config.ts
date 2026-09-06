import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type PluginOption, type UserConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

// TanStack Start + Vite config: Tailwind, path aliases from tsconfig,
// TanStack Start's router/SSR plugin, React, and (build-only) Nitro as the
// deploy adapter, targeting Cloudflare by default.
export default defineConfig(async ({ command, mode }) => {
  // Injects VITE_*-prefixed env vars as import.meta.env.* define()s, matching
  // Vite's own client-side env exposure so it also works in server code.
  const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(loadedEnv)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  const plugins: PluginOption[] = [];

  if (mode === "development") {
    const { devtools } = await import("@tanstack/devtools-vite");
    plugins.push(devtools());
  }

  plugins.push(
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
      // nitro/vite builds from this — see src/server.ts (our SSR error wrapper).
      server: { entry: "server" },
    }),
    viteReact(),
  );

  // Nitro (deploy adapter) only runs for production builds.
  if (command === "build") {
    const { nitro } = await import("nitro/vite");
    plugins.push(nitro({ defaultPreset: "cloudflare-module" }));
  }

  const config: UserConfig = {
    define: envDefine,
    css: { transformer: "lightningcss" },
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime"],
      ignoreOutdatedRequests: true,
    },
    server: { host: "::", port: 8080 },
    plugins,
  };

  return config;
});

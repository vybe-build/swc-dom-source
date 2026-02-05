import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  experimental: {
    swcPlugins: [
      [
        "@vybe-adk/swc-dom-source",
        { attr: "data-source", exclude: ["components/ui"] },
      ],
    ],
  },
};

export default nextConfig;

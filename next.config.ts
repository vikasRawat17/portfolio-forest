import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config silences the "webpack config present but no turbopack config" error in Next.js 16.
  // Turbopack handles WASM natively; the webpack config below applies when building with --webpack.
  turbopack: {},
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });
    return config;
  },
};

export default nextConfig;

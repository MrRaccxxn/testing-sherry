import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        process: require.resolve("process/browser"),
        buffer: require.resolve("buffer"),
        stream: require.resolve("stream-browserify"),
        util: require.resolve("util"),
        assert: require.resolve("assert"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        os: require.resolve("os-browserify/browser"),
        url: require.resolve("url"),
      };
    }
    return config;
  },
};

export default nextConfig;

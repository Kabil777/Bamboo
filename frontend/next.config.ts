import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            yjs: require.resolve("yjs"),
        };

        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*",
            },
        ],
        unoptimized: true,
    },
};

export default nextConfig;

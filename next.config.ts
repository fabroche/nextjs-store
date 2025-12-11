import type {NextConfig} from "next";

import path, {dirname} from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig: NextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, "src/sass")],
        prependData: `@import "main.sass"`,
    },
    images: {
        remotePatterns: [{
            hostname: 'cdn.shopify.com',
            protocol: 'https',
        }]
    }
};

export default nextConfig;

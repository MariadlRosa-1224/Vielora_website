import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
    sassOptions: {
    additionalData: `$var: red;`,
    implementation: 'sass-embedded',
  },
/*     output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  }, */
};

export default nextConfig;

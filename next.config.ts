import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
    sassOptions: {
    additionalData: `$var: red;`,
    implementation: 'sass-embedded',
    },

    output: "standalone",

     images: {
    unoptimized: true,
  },
    /*     
  trailingSlash: true,
  */
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  node: {
    net: "empty",
  },
  staticPageGenerationTimeout: 360,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

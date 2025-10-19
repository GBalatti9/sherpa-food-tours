/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export", // 👈 genera la carpeta out
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  experimental: {
    serverActions: {
      timeout: 300, // 5 minutos
    },
  },

  async redirects() {
    return [
      {
        source: '/travels-guide',
        destination: '/travel-guide',
        permanent: true,
      },
    ];
  },

  ...(process.env.NODE_ENV === 'development' && {
    compiler: {
      removeConsole: false,
    },
  }),
};

module.exports = nextConfig;

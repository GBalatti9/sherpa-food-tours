/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export", // 👈 genera la carpeta out
  // Agregar logging detallado
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Si tienes problemas de timeout
  experimental: {
    serverActions: {
      timeout: 300, // 5 minutos
    },
  },

  async redirects(){
    return [
      {
        source: '/travels-guide',
        destination: '/travel-guide',
        permanent: true,
      },
    ]
  },

  // Para debugging
  ...(process.env.NODE_ENV === 'development' && {
    compiler: {
      removeConsole: false,
    },
  }),
}

module.exports = nextConfig
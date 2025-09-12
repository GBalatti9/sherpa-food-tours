/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
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
  
  // Para debugging
  ...(process.env.NODE_ENV === 'development' && {
    compiler: {
      removeConsole: false,
    },
  }),
}

module.exports = nextConfig
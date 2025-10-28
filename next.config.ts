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
      {
        source: '/argentinian-cookies-alfajores',
        destination: '/travel-guide/buenos-aires/argentinian-cookies-alfajores',
        permanent: true,
      },
      {
        source: '/best-bakeries-in-mexico-city',
        destination: '/travel-guide/mexico-city/best-bakeries-in-mexico-city',
        permanent: true,
      },
      {
        source: '/best-indonesian-restaurants-amsterdam',
        destination: '/travel-guide/amsterdam/best-indonesian-restaurants-amsterdam',
        permanent: true,
      },
      {
        source: '/shop-til-you-drop-uncover-buenos-aires-best-shopping-areas',
        destination: '/travel-guide/buenos-aires/shop-til-you-drop-uncover-buenos-aires-best-shopping-areas',
        permanent: true,
      },
      {
        source: '/best-casual-restaurants-amsterdam',
        destination: '/travel-guide/amsterdam/best-casual-restaurants-amsterdam',
        permanent: true,
      },
      {
        source: '/vegan-food-tour-paris',
        destination: '/travel-guide/paris/vegan-food-tour-paris',
        permanent: true,
      },
      {
        source: '/best-cheese-shop-in-amsterdam',
        destination: '/travel-guide/amsterdam/best-cheese-shop-in-amsterdam',
        permanent: true,
      },
      {
        source: '/best-stroopwafel-amsterdam',
        destination: '/travel-guide/amsterdam/best-stroopwafel-amsterdam',
        permanent: true,
      },
      {
        source: '/best-steakhouses-in-buenos-aires',
        destination: '/travel-guide/buenos-aires/best-steakhouses-in-buenos-aires',
        permanent: true,
      },
      {
        source: '/amsterdam-street-food',
        destination: '/travel-guide/amsterdam/amsterdam-street-food',
        permanent: true,
      },
      {
        source: '/best-bitterballen-amsterdam',
        destination: '/travel-guide/amsterdam/best-bitterballen-amsterdam',
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

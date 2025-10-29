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

      // Redireccion a url viejas
      {
        source: '/travel-guide/buenos-aires/traditional-argentine-drinks-and-where-to-try-them',
        destination: '/traditional-argentine-drinks-and-where-to-try-them',
        permanent: true,
      },
      {
        source: '/travel-guide/argentina/argentinian-desserts-list',
        destination: '/argentinian-desserts-list',
        permanent: true,
      },
      {
        source: '/travel-guide/amsterdam/best-croquettes-in-amsterdam',
        destination: '/best-croquettes-in-amsterdam',
        permanent: true,
      },
      {
        source: '/travel-guide/buenos-aires/savour-the-traditions-the-best-spots-to-drink-mate-in-buenos-aires',
        destination: '/savour-the-traditions-the-best-spots-to-drink-mate-in-buenos-aires',
        permanent: true,
      },
      {
        source: '/travel-guide/amsterdam/best-surinam-restaurants-amsterdam',
        destination: '/best-surinam-restaurants-amsterdam',
        permanent: true,
      },
      {
        source: '/travel-guide/buenos-aires/ultimate-guide-to-argentinas-food-culture',
        destination: '/ultimate-guide-to-argentinas-food-culture',
        permanent: true,
      },
      {
        source: '/travel-guide/buenos-aires/sports-passion-in-buenos-aires-the-5-best-sports-bars',
        destination: '/sports-passion-in-buenos-aires-the-5-best-sports-bars',
        permanent: true,
      },
      {
        source: '/travel-guide/london/best-dishoom-in-london',
        destination: '/best-dishoom-in-london',
        permanent: true,
      },
      {
        source: '/travel-guide/buenos-aires/cocktails-in-the-clouds-the-ultimate-rooftop-bars-in-buenos-aires',
        destination: '/cocktails-in-the-clouds-the-ultimate-rooftop-bars-in-buenos-aires',
        permanent: true,
      },
      {
        source: '/travel-guide/buenos-aires/where-italy-meets-argentina-best-italian-restaurants-in-buenos-aires',
        destination: '/where-italy-meets-argentina-best-italian-restaurants-in-buenos-aires',
        permanent: true,
      },
      {
        source: '/travel-guide/buenos-aires/explore-these-3-michelin-star-restaurants-in-buenos-aires',
        destination: '/explore-these-3-michelin-star-restaurants-in-buenos-aires',
        permanent: true,
      },
      {
        source: '/travel-guide/mexico-city/michelin-star-restaurants-mexico-city',
        destination: '/michelin-star-restaurants-mexico-city',
        permanent: true,
      },
      {
        source: '/travel-guide/argentina/best-ice-cream-in-argentina',
        destination: '/best-ice-cream-in-argentina',
        permanent: true,
      },
      {
        source: '/travel-guide/buenos-aires/7-must-visit-breweries-in-buenos-aires-for-craft-beer-lovers',
        destination: '/7-must-visit-breweries-in-buenos-aires-for-craft-beer-lovers',
        permanent: true,
      },
      {
        source: '/travel-guide/cdmx/best-restaurants-in-roma-norte-cdmx',
        destination: '/best-restaurants-in-roma-norte-cdmx',
        permanent: true,
      },
      {
        source: '/travel-guide/paris/poulette-restaurants-in-paris',
        destination: '/poulette-restaurants-in-paris',
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

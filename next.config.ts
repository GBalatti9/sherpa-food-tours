/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
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

  compress: true, // Habilitar compresión GZIP
  poweredByHeader: false, // Remover header X-Powered-By
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'staging.sherpafoodtours.com',
      },
      {
        protocol: 'https',
        hostname: 'www.sherpafoodtours.com',
      },
      {
        protocol: 'https',
        hostname: 'sherpafoodtours.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 año de caché para imágenes optimizadas
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async redirects() {
    return [
      {
        source: '/travels-guide/',
        destination: '/travel-guide/',
        permanent: true,
      },
      {
        source: '/travels-guide/:path*',
        destination: '/travel-guide/',
        permanent: true,
      },
      {
        source: '/argentinian-cookies-alfajores/',
        destination: '/travel-guide/buenos-aires/argentinian-cookies-alfajores/',
        permanent: true,
      },
      {
        source: '/48-hours-in-buenos-aires-the-best-things-to-do-in-this-vibrant-city',
        destination: '/travel-guide/buenos-aires/48-hours-in-buenos-aires-the-best-things-to-do-in-this-vibrant-city',
        permanent: true,
      },
      {
        source: '/best-bakeries-in-mexico-city/',
        destination: '/travel-guide/mexico-city/best-bakeries-in-mexico-city/',
        permanent: true,
      },
      {
        source: '/best-indonesian-restaurants-amsterdam/',
        destination: '/travel-guide/amsterdam/best-indonesian-restaurants-amsterdam/',
        permanent: true,
      },
      {
        source: '/the-best-bars-in-amsterdam-top-15-drinking-spots/',
        destination: '/travel-guide/amsterdam/the-best-bars-in-amsterdam/',
        permanent: true,
      },
      {
        source: '/amsterdam-dining-experience/',
        destination: '/travel-guide/amsterdam/amsterdam-dining-experience/',
        permanent: true,
      },
      {
        source: '/shop-til-you-drop-uncover-buenos-aires-best-shopping-areas/',
        destination: '/travel-guide/buenos-aires/shop-til-you-drop-uncover-buenos-aires-best-shopping-areas/',
        permanent: true,
      },
      {
        source: '/best-casual-restaurants-amsterdam/',
        destination: '/travel-guide/amsterdam/best-casual-restaurants-amsterdam/',
        permanent: true,
      },
      {
        source: '/vegan-food-tour-paris/',
        destination: '/travel-guide/paris/vegan-food-tour-paris/',
        permanent: true,
      },
      {
        source: '/best-cheese-shop-in-amsterdam/',
        destination: '/travel-guide/amsterdam/best-cheese-shop-in-amsterdam/',
        permanent: true,
      },
      {
        source: '/best-stroopwafel-amsterdam/',
        destination: '/travel-guide/amsterdam/best-stroopwafel-amsterdam/',
        permanent: true,
      },
      {
        source: '/best-steakhouses-in-buenos-aires/',
        destination: '/travel-guide/buenos-aires/best-steakhouses-in-buenos-aires/',
        permanent: true,
      },
      {
        source: '/amsterdam-street-food/',
        destination: '/travel-guide/amsterdam/amsterdam-street-food/',
        permanent: true,
      },
      {
        source: '/best-bitterballen-amsterdam/',
        destination: '/travel-guide/amsterdam/best-bitterballen-amsterdam/',
        permanent: true,
      },

      // --- RUTAS VIEJAS IMPORTANTES (las que vos quieras mantener) ---
      {
        source: '/traditional-argentine-drinks-and-where-to-try-them/',
        destination: '/travel-guide/buenos-aires/traditional-argentine-drinks-and-where-to-try-them/',
        permanent: true,
      },
      {
        source: '/traditional-argentine-drinks/',
        destination: '/travel-guide/buenos-aires/traditional-argentine-drinks-and-where-to-try-them/',
        permanent: true,
      },
      {
        source: '/tour/londres-food-tour/',
        destination: '/tour/london-food-tour/',
        permanent: true,
      },
      {
        source: '/sobre-nosotros/',
        destination: '/about-us/',
        permanent: true,
      },
      {
        source: '/about-us-2/',
        destination: '/about-us/',
        permanent: true,
      },
      {
        source: '/es/traditional-argentine-drinks-and-where-to-try-them-3/',
        destination: '/travel-guide/buenos-aires/traditional-argentine-drinks-and-where-to-try-them/',
        permanent: true,
      },
      {
        source: '/pt/traditional-argentine-drinks-and-where-to-try-them-2/',
        destination: '/travel-guide/buenos-aires/traditional-argentine-drinks-and-where-to-try-them/',
        permanent: true,
      },
      {
        source: '/argentinian-desserts-list/',
        destination: '/travel-guide/argentina/argentinian-desserts-list/',
        permanent: true,
      },
      {
        source: '/best-croquettes-in-amsterdam/',
        destination: '/travel-guide/amsterdam/best-croquettes-in-amsterdam/',
        permanent: true,
      },
      {
        source: '/savour-the-traditions-the-best-spots-to-drink-mate-in-buenos-aires/',
        destination: '/travel-guide/buenos-aires/savour-the-traditions-the-best-spots-to-drink-mate-in-buenos-aires/',
        permanent: true,
      },
      {
        source: '/best-surinam-restaurants-amsterdam/',
        destination: '/travel-guide/amsterdam/best-surinam-restaurants-amsterdam/',
        permanent: true,
      },
      {
        source: '/ultimate-guide-to-argentinas-food-culture/',
        destination: '/travel-guide/buenos-aires/ultimate-guide-to-argentinas-food-culture/',
        permanent: true,
      },
      {
        source: '/ultimate-guide-to-argentinas-food-culture-2/',
        destination: '/travel-guide/buenos-aires/ultimate-guide-to-argentinas-food-culture/',
        permanent: true,
      },
      {
        source: '/ultimate-guide-to-argentinas-food-culture-3/',
        destination: '/travel-guide/buenos-aires/ultimate-guide-to-argentinas-food-culture/',
        permanent: true,
      },
      {
        source: '/travel-guide/buenos-aires/food-in-buenos-aires-culture/',
        destination: '/travel-guide/buenos-aires/ultimate-guide-to-argentinas-food-culture/',
        permanent: true,
      },
      {
        source: '/tour/san-telmo-food-tour/',
        destination: '/tour/san-telmo-tour-2/',
        permanent: true,
      },
      {
        source: '/tour/san-telmo-food-tour-4/',
        destination: '/tour/san-telmo-tour-2/',
        permanent: true,
      },
      {
        source: '/sports-passion-in-buenos-aires-the-5-best-sports-bars/',
        destination: '/travel-guide/buenos-aires/sports-passion-in-buenos-aires-the-5-best-sports-bars/',
        permanent: true,
      },
      {
        source: '/best-dishoom-in-london/',
        destination: '/travel-guide/london/best-dishoom-in-london/',
        permanent: true,
      },
      {
        source: '/cocktails-in-the-clouds-the-ultimate-rooftop-bars-in-buenos-aires/',
        destination: '/travel-guide/buenos-aires/cocktails-in-the-clouds-the-ultimate-rooftop-bars-in-buenos-aires/',
        permanent: true,
      },
      {
        source: '/where-italy-meets-argentina-best-italian-restaurants-in-buenos-aires/',
        destination: '/travel-guide/buenos-aires/where-italy-meets-argentina-best-italian-restaurants-in-buenos-aires/',
        permanent: true,
      },
      {
        source: '/explore-these-3-michelin-star-restaurants-in-buenos-aires/',
        destination: '/travel-guide/buenos-aires/explore-these-3-michelin-star-restaurants-in-buenos-aires/',
        permanent: true,
      },
      {
        source: '/michelin-star-restaurants-mexico-city/',
        destination: '/travel-guide/mexico-city/michelin-star-restaurants-mexico-city/',
        permanent: true,
      },
      {
        source: '/best-ice-cream-in-argentina/',
        destination: '/travel-guide/argentina/best-ice-cream-in-argentina/',
        permanent: true,
      },
      {
        source: '/7-must-visit-breweries-in-buenos-aires-for-craft-beer-lovers/',
        destination: '/travel-guide/buenos-aires/7-must-visit-breweries-in-buenos-aires-for-craft-beer-lovers/',
        permanent: true,
      },
      {
        source: '/tour/palermo-food-tour-2/',
        destination: '/tour/buenos-aires-local-foodie-experience/',
        permanent: true,
      },
      {
        source: '/tour/palermo-food-tour-3/',
        destination: '/tour/buenos-aires-local-foodie-experience/',
        permanent: true,
      },
      {
        source: '/tour/palermo-food-tour-4/',
        destination: '/tour/buenos-aires-local-foodie-experience/',
        permanent: true,
      },
      {
        source: '/best-restaurants-in-roma-norte-cdmx/',
        destination: '/travel-guide/cdmx/best-restaurants-in-roma-norte-cdmx/',
        permanent: true,
      },
      {
        source: '/best-restaurants-in-mexico-city/',
        destination: '/travel-guide/cdmx/best-restaurants-in-roma-norte-cdmx/',
        permanent: true,
      },
      {
        source: '/poulette-restaurants-in-paris/',
        destination: '/travel-guide/paris/poulette-restaurants-in-paris/',
        permanent: true,
      },
      {
        source: '/what-is-asado-in-argentina/',
        destination: '/travel-guide/buenos-aires/what-is-asado-in-argentina/',
        permanent: true,
      },
      {
        source: '/es/what-is-asado-in-argentina-3/',
        destination: '/travel-guide/buenos-aires/what-is-asado-in-argentina/',
        permanent: true,
      },
      {
        source: '/pt/what-is-asado-in-argentina-2/',
        destination: '/travel-guide/buenos-aires/what-is-asado-in-argentina/',
        permanent: true,
      },
      {
        source: '/6-best-places-to-enjoy-empanadas-in-buenos-aires/',
        destination: '/travel-guide/buenos-aires/6-best-places-to-enjoy-empanadas-in-buenos-aires/',
        permanent: true,
      },
      {
        source: '/buenos-aires-food-what-to-eat-and-where/',
        destination: '/travel-guide/buenos-aires/buenos-aires-food-what-to-eat-and-where/',
        permanent: true,
      },
      {
        source: '/pt/buenos-aires-food-what-to-eat-and-where-2/',
        destination: '/travel-guide/buenos-aires/buenos-aires-food-what-to-eat-and-where/',
        permanent: true,
      },
      {
        source: '/pt/buenos-aires-food-what-to-eat-and-where-3/',
        destination: '/travel-guide/buenos-aires/buenos-aires-food-what-to-eat-and-where/',
        permanent: true,
      },
      {
        source: '/mexican-fruit-juices/',
        destination: '/travel-guide/mexico-city/mexican-fruit-juices/',
        permanent: true,
      },
      {
        source: '/mexico-city-vegan-food-tour/',
        destination: '/travel-guide/mexico-city/vegan-restaurants-mexico-city/',
        permanent: true,
      },
      {
        source: '/best-wine-bars-in-amsterdam/',
        destination: '/travel-guide/amsterdam/best-wine-bars-in-amsterdam/',
        permanent: true,
      },
      {
        source: '/best-brown-cafe-in-amsterdam/',
        destination: '/travel-guide/amsterdam/best-brown-cafe-in-amsterdam/',
        permanent: true,
      },
      {
        source: '/travel-guide/argentina/',
        destination: '/travel-guide/buenos-aires/best-food-buenos-aires/',
        permanent: true,
      },
      {
        source: '/best-food-buenos-aires/',
        destination: '/travel-guide/buenos-aires/best-food-buenos-aires/',
        permanent: true,
      },
      {
        source: '/explore-buenos-aires-top-museums-and-their-finest-on-site-restaurants/',
        destination: '/travel-guide/buenos-aires/explore-buenos-aires-top-museums-and-their-finest-on-site-restaurants/',
        permanent: true,
      },
      {
        source: '/green-escapes-top-parks-to-visit-in-buenos-aires/',
        destination: '/travel-guide/buenos-aires/green-escapes-top-parks-to-visit-in-buenos-aires/',
        permanent: true,
      },
      {
        source: '/argentinian-cookies-explained-the-gluttons-guide-to-alfajores/',
        destination: '/travel-guide/buenos-aires/argentinian-cookies-alfajores/',
        permanent: true,
      },
      {
        source: '/best-affordable-restaurants-in-paris/',
        destination: '/travel-guide/paris/best-affordable-restaurants-in-paris/',
        permanent: true,
      },
      {
        source: '/paris-restaurants-with-a-view/',
        destination: '/travel-guide/paris/paris-restaurants-with-a-view/',
        permanent: true,
      },
      {
        source: '/top-bistros-in-paris/',
        destination: '/travel-guide/paris/top-bistros-in-paris/',
        permanent: true,
      },
      {
        source: '/michelin-star-restaurants-paris/',
        destination: '/travel-guide/paris/michelin-star-restaurants-paris/',
        permanent: true,
      },
      {
        source: '/paris-food-experience/',
        destination: '/travel-guide/paris/paris-food-experience/',
        permanent: true,
      },
      {
        source: '/parisian-cafes/',
        destination: '/travel-guide/paris/parisian-cafes/',
        permanent: true,
      },
      {
        source: '/best-macarons-in-paris/',
        destination: '/travel-guide/paris/best-macarons-in-paris/',
        permanent: true,
      },
      {
        source: '/travel-guide/paris/',
        destination: '/travel-guide/paris/parisian-cafes/',
        permanent: true,
      },
      {
        source: '/bakeries-in-paris/',
        destination: '/travel-guide/paris/bakeries-in-paris/',
        permanent: true,
      },
      {
        source: '/london-restaurants-with-a-view/',
        destination: '/travel-guide/london/london-restaurants-with-a-view/',
        permanent: true,
      },
      {
        source: '/a-taste-of-india-in-the-heart-of-london-the-10-best-indian-restaurants-to-try/',
        destination: '/travel-guide/london/a-taste-of-india-in-the-heart-of-london-the-10-best-indian-restaurants-to-try/',
        permanent: true,
      },
      {
        source: '/london-street-food/',
        destination: '/travel-guide/london/the-best-food-markets-in-london-from-street-eats-to-gourmet-treats/',
        permanent: true,
      },
      {
        source: '/mercado-de-san-telmo-get-to-know-the-buenos-aires-historic-flea-market/',
        destination: '/travel-guide/buenos-aires/mercado-de-san-telmo-get-to-know-the-buenos-aires-historic-flea-market/',
        permanent: true,
      },
      {
        source: '/coffee-shops-in-amsterdam/',
        destination: '/travel-guide/amsterdam/coffee-shops-in-amsterdam/',
        permanent: true,
      },
      {
        source: '/a-complete-guide-to-the-20-best-restaurants-in-amsterdam/',
        destination: '/travel-guide/amsterdam/a-complete-guide-to-the-20-best-restaurants-in-amsterdam/',
        permanent: true,
      },
      {
        source: '/amsterdam-food/',
        destination: '/travel-guide/amsterdam/amsterdam-food/',
        permanent: true,
      },
      {
        source: '/london-food-culture/',
        destination: '/travel-guide/london/london-food-culture/',
        permanent: true,
      },
      {
        source: '/the-best-restaurants-for-modern-british-food-in-london/',
        destination: '/travel-guide/london/the-best-restaurants-for-modern-british-food-in-london/',
        permanent: true,
      },
      {
        source: '/travel-guide/london/',
        destination: '/travel-guide/london/london-food-culture/',
        permanent: true,
      },
      {
        source: '/top-10-restaurants-in-mexico-city/',
        destination: '/travel-guide/mexico-city/top-10-restaurants-in-mexico-city/',
        permanent: true,
      },
      {
        source: '/top-10-restaurants-in-mexico-city/',
        destination: '/travel-guide/mexico-city/best-restaurants-in-mexico-city/',
        permanent: true,
      },
      {
        source: '/traditional-mexican-drinks/',
        destination: '/travel-guide/mexico-city/traditional-mexican-drinks/',
        permanent: true,
      },
      {
        source: '/spicy-mexican-dishes-for-heat-lovers/',
        destination: '/travel-guide/mexico-city/spicy-mexican-dishes-for-heat-lovers/',
        permanent: true,
      },
      {
        source: '/amsterdams-best-food-markets-for-every-appetite/',
        destination: '/travel-guide/amsterdam/amsterdams-best-food-markets-for-every-appetite/',
        permanent: true,
      },
      {
        source: '/michelin-restaurants-amsterdam/',
        destination: '/travel-guide/amsterdam/michelin-restaurants-amsterdam/',
        permanent: true,
      },
      {
        source: '/mexico-city-street-food-tour/',
        destination: '/travel-guide/mexico-city/mexico-city-street-food-tour/',
        permanent: true,
      },
      {
        source: '/best-wine-bars-mexico-city/',
        destination: '/travel-guide/mexico-city/best-wine-bars-mexico-city/',
        permanent: true,
      },
      {
        source: '/michelin-star-tacos-in-mexico-city/',
        destination: '/travel-guide/mexico-city/michelin-star-tacos-in-mexico-city/',
        permanent: true,
      },
      {
        source: '/best-churros-in-mexico-city/',
        destination: '/travel-guide/mexico-city/best-churros-in-mexico-city/',
        permanent: true,
      },
      {
        source: '/3-day-buenos-aires-itinerary/',
        destination: '/travel-guide/buenos-aires/3-day-buenos-aires-itinerary/',
        permanent: true,
      },
      {
        source: '/from-bars-to-bodegas-the-ultimate-ba-wine-tour/',
        destination: '/travel-guide/buenos-aires/from-bars-to-bodegas-the-ultimate-ba-wine-tour/',
        permanent: true,
      },
      {
        source: '/es/buenos-aires-food-what-to-eat-and-where-2/',
        destination: '/travel-guide/buenos-aires/buenos-aires-food-what-to-eat-and-where/',
        permanent: true,
      },
      {
        source: '/fernet-culture-buenos-aires/',
        destination: '/travel-guide/buenos-aires/fernet-culture-buenos-aires/',
        permanent: true,
      },
      {
        source: '/buenos-aires-street-food/',
        destination: '/travel-guide/buenos-aires/buenos-aires-street-food/',
        permanent: true,
      },
      {
        source: '/raise-a-glass-discover-the-10-best-bars-in-buenos-aires/',
        destination: '/travel-guide/buenos-aires/raise-a-glass-discover-the-10-best-bars-in-buenos-aires/',
        permanent: true,
      },
      {
        source: '/buenos-aires-best-cocktail-bars-a-neighbourhood-guide/',
        destination: '/travel-guide/buenos-aires/raise-a-glass-discover-the-10-best-bars-in-buenos-aires/',
        permanent: true,
      },
      {
        source: '/things-to-do-in-san-telmo-buenos-aires/',
        destination: '/travel-guide/buenos-aires/things-to-do-in-san-telmo-buenos-aires/',
        permanent: true,
      },
      {
        source: '/things-to-do-in-san-telmo-buenos-aires-2/',
        destination: '/travel-guide/buenos-aires/things-to-do-in-san-telmo-buenos-aires/',
        permanent: true,
      },
      {
        source: '/3-day-buenos-aires-itinerary/',
        destination: '/travel-guide/buenos-aires/3-day-buenos-aires-itinerary/',
        permanent: true,
      },
      {
        source: '/green-escapes-top-parks-to-visit-in-buenos-aires//',
        destination: '/travel-guide/buenos-aires/green-escapes-top-parks-to-visit-in-buenos-aires//',
        permanent: true,
      },
      {
        source: '/pt/city/buenos-aires-3/',
        destination: '/city/buenos-aires-2/',
        permanent: true,
      },
      {
        source: '/es/city/buenos-aires-2/',
        destination: '/city/buenos-aires-2/',
        permanent: true,
      },
      {
        source: '/es/tour/palermo-food-tour-3//',
        destination: '/tour/buenos-aires-local-foodie-experience/',
        permanent: true,
      },
      {
        source: '/tour',
        destination: '/tour/buenos-aires-local-foodie-experience/',
        permanent: true,
      },
      {
        source: '/the-best-day-trips-from-london-history-culture-and-seaside-escapes/',
        destination: '/travel-guide/london/the-best-day-trips-from-london-history-culture-and-seaside-escapes/',
        permanent: true,
      },
      {
        source: '/best-pizza-in-buenos-aires/',
        destination: '/travel-guide/buenos-aires/best-pizza-in-buenos-aires/',
        permanent: true,
      },
      {
        source: '/best-restaurants-in-buenos-aires/',
        destination: '/travel-guide/buenos-aires/best-restaurants-in-buenos-aires/',
        permanent: true,
      },
      {
        source: '/explore-the-best-bookshops-in-buenos-aires/',
        destination: '/travel-guide/buenos-aires/explore-the-best-bookshops-in-buenos-aires/',
        permanent: true,
      },
      {
        source: '/discover-the-ultimate-london-food-tour-with-sherpa/',
        destination: '/travel-guide/buenos-aires/discover-the-ultimate-london-food-tour-with-sherpa/',
        permanent: true,
      },
      {
        source: '/48-hours-in-buenos-aires-the-best-things-to-do-in-this-vibrant-city/',
        destination: '/travel-guide/buenos-aires/48-hours-in-buenos-aires-the-best-things-to-do-in-this-vibrant-city/',
        permanent: true,
      },
      {
        source: '/best-argentinian-restaurants-in-buenos-aires/',
        destination: '/travel-guide/buenos-aires/best-argentine-restaurants-in-buenos-aires/',
        permanent: true,
      },
      {
        source: '/best-neighborhoods-buenos-aires/',
        destination: '/travel-guide/buenos-aires/best-neighborhoods-buenos-aires/',
        permanent: true,
      },
      {
        source: '/the-10-best-things-to-do-in-buenos-aires/',
        destination: '/travel-guide/buenos-aires/the-10-best-things-to-do-in-buenos-aires/',
        permanent: true,
      },
      {
        source: '/walking-food-tours-amsterdam/',
        destination: '/travel-guide/amsterdam/walking-food-tour-amsterdam/',
        permanent: true,
      },
      {
        source: '/top-restaurants-in-amsterdam/',
        destination: '/travel-guide/amsterdam/top-restaurants-in-amsterdam/',
        permanent: true,
      },
      {
        source: '/walking-food-tours-amsterdam/',
        destination: '/travel-guide/amsterdam/walking-food-tours-amsterdam/',
        permanent: true,
      },
      {
        source: '/eating-amsterdam/',
        destination: '/travel-guide/amsterdam/eating-amsterdam/',
        permanent: true,
      },
      {
        source: '/best-taquerias-mexico-city/',
        destination: '/travel-guide/mexico-city/best-taquerias-mexico-city/',
        permanent: true,
      },
      {
        source: '/mexico-city-vegan-food-tour/',
        destination: '/travel-guide/mexico-city/vegan-restaurants-mexico-city/',
        permanent: true,
      },
      {
        source: '/secret-food-tours-mexicy-city/',
        destination: '/travel-guide/mexico-city/secret-food-tours-mexicy-city/',
        permanent: true,
      },
      {
        source: '/vegan-restaurants-mexico-city/',
        destination: '/travel-guide/mexico-city/vegan-restaurants-mexico-city/',
        permanent: true,
      },
      {
        source: '/best-speakeasy-in-mexico-city/',
        destination: '/travel-guide/mexico-city/best-speakeasy-in-mexico-city/',
        permanent: true,
      },
      {
        source: '/tamales-in-mexico-city/',
        destination: '/travel-guide/mexico-city/tamales-in-mexico-city/',
        permanent: true,
      },
      {
        source: '/indian-food-tour-london/',
        destination: '/travel-guide/london/a-taste-of-india-in-the-heart-of-london-the-10-best-indian-restaurants-to-try/',
        permanent: true,
      },
      {
        source: '/the-best-food-markets-in-london-from-street-eats-to-gourmet-treats/',
        destination: '/travel-guide/london/the-best-food-markets-in-london-from-street-eats-to-gourmet-treats/',
        permanent: true,
      },
      {
        source: '/the-best-coffee-shops-in-london-a-guide-for-true-caffeine-connoisseurs/',
        destination: '/travel-guide/london/the-best-coffee-shops-in-london-a-guide-for-true-caffeine-connoisseurs/',
        permanent: true,
      },
      {
        source: '/best-steak-in-london/',
        destination: '/travel-guide/london/best-steak-in-london/',
        permanent: true,
      },
      {
        source: '/hidden-gem-restaurants-mexico-city/',
        destination: '/travel-guide/mexico-city/hidden-gem-restaurants-mexico-city/',
        permanent: true,
      },
      {
        source: '/mexican-desserts/',
        destination: '/travel-guide/mexico-city/mexican-desserts/',
        permanent: true,
      },
      {
        source: '/best-places-to-eat-in-mexico-city/',
        destination: '/travel-guide/mexico-city/best-places-to-eat-in-mexico-city/',
        permanent: true,
      },
      {
        source: '/best-restaurants-in-paris/',
        destination: '/travel-guide/paris/best-restaurants-in-paris/',
        permanent: true,
      },

      {
        source: '/secret-food-tour-london/',
        destination: '/travel-guide/london/private-food-tour-in-london/',
        permanent: true,
      },
      {
        source: '/travel-guide/buenos-aires/best-food-buenos-aires/',
        destination: '/travel-guide/buenos-aires/buenos-aires-food-what-to-eat-and-where/',
        permanent: true,
      },
      {
        source: '/travel-guide/buenos-aires/what-to-eat-in-buenos-aires-where/',
        destination: '/travel-guide/buenos-aires/buenos-aires-food-what-to-eat-and-where/',
        permanent: true,
      },
      {
        source: '/travel-guide/amsterdam/best-brown-cafes-in-amsterdam/',
        destination: '/travel-guide/amsterdam/best-brown-cafe-in-amsterdam/',
        permanent: true,
      },
      {
        source: '/the-insiders-guide-to-the-best-steakhouses-in-buenos-aires/',
        destination: '/travel-guide/buenos-aires/best-steakhouses-in-buenos-aires/',
        permanent: true,
      },

      {
        source: '/travel-guide/buenos-aires/best-food-buenos-aires/',
        destination: '/travel-guide/buenos-aires/buenos-aires-food-what-to-eat-and-where/',
        permanent: true,
      },

      {
        source: '/5-things-to-know-before-visiting-argentina/',
        destination: '/city/buenos-aires-2/',
        permanent: true,
      },
      {
        source: '/beyond-the-city-best-day-trips-from-buenos-aires/',
        destination: '/city/buenos-aires-2/',
        permanent: true,
      },
      {
        source: '/famous-restaurants-in-paris/',
        destination: '/city/paris/',
        permanent: true,
      },


    ];
  },

  async headers() {
    return [
      {
        // Headers para todas las rutas
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'  // era SAMEORIGIN
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fareharbor.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://staging.sherpafoodtours.com https://www.sherpafoodtours.com",
              "font-src 'self'",
              "connect-src 'self' https://staging.sherpafoodtours.com https://fareharbor.com",
              "frame-src https://fareharbor.com",
              "frame-ancestors 'none'",
            ].join('; ')
          }
        ],
      },
      {
        // Cache para assets estáticos (JS, CSS) - 1 año en producción, sin cache en desarrollo
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: process.env.NODE_ENV === 'production'
              ? 'public, max-age=31536000, immutable'
              : 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        // Cache para fuentes - 1 año
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache para imágenes estáticas en /public - 1 mes
        source: '/:path*\\.(jpg|jpeg|png|gif|webp|avif|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, must-revalidate',
          },
        ],
      },
      {
        // Cache para otros assets estáticos (SVG, etc.) - 1 mes
        source: '/:path*\\.(svg|ico|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable',
          },
        ],
      },
      {
        // No cache para páginas HTML - siempre revalidar
        source: '/:path*\\.(html|htm)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        // Cache corto para API routes - 5 minutos
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=60',
          },
        ],
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

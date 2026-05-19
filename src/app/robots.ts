import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private/', '/admin/', '/api/'],
      },
      {
        // Allow AI search crawlers (Google AIO, ChatGPT search, Perplexity)
        userAgent: ['GPTBot', 'Google-Extended', 'PerplexityBot', 'OAI-SearchBot'],
        allow: '/',
        disallow: ['/private/', '/admin/', '/api/'],
      },
      {
        // Block AI training-only crawlers (not search)
        userAgent: ['CCBot', 'anthropic-ai', 'cohere-ai', 'FacebookBot'],
        disallow: ['/'],
      },
    ],
    sitemap: 'https://www.sherpafoodtours.com/sitemap.xml',
    host: 'https://www.sherpafoodtours.com',
  }
}

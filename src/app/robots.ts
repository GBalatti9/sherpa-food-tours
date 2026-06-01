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
        // Allow FacebookBot (Meta link preview crawler - NOT a training bot)
        userAgent: ['FacebookBot'],
        allow: '/',
        disallow: ['/private/', '/admin/', '/api/'],
      },
      {
        // Allow ClaudeBot (Anthropic's live browsing agent)
        userAgent: ['ClaudeBot'],
        allow: '/',
        disallow: ['/private/', '/admin/', '/api/'],
      },
      {
        // Block AI training-only crawlers (not search)
        userAgent: ['CCBot', 'anthropic-ai', 'cohere-ai'],
        disallow: ['/'],
      },
    ],
    sitemap: 'https://www.sherpafoodtours.com/sitemap.xml',
    host: 'https://www.sherpafoodtours.com',
  }
}

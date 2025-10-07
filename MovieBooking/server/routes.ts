import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Lightweight image proxy to avoid hotlink/CORS/referrer issues for posters
  app.get('/api/proxy', async (req, res) => {
    try {
      const url = req.query.url as string | undefined;
      if (!url) {
        return res.status(400).json({ message: 'Missing url parameter' });
      }

      // Basic allowlist: only proxy Wikimedia URLs to keep things safe
      const allowedHosts = [
        'upload.wikimedia.org',
        'static.wikia.nocookie.net',
        'image.tmdb.org',
        'm.media-amazon.com',
      ];

      const target = new URL(url);
      if (!allowedHosts.includes(target.hostname)) {
        return res.status(400).json({ message: 'Host not allowed' });
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      // Build minimal headers, setting referer dynamically to the target origin
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        // For Wikimedia, set referer to en.wikipedia.org to avoid edge oddities; otherwise use origin
        'Referer': target.hostname === 'upload.wikimedia.org' ? 'https://en.wikipedia.org/' : target.origin,
        'Accept-Language': 'en-US,en;q=0.5',
      } as const;

      const upstream = await fetch(target.toString(), {
        // Some CDNs are picky about headers; keep minimal
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!upstream.ok) {
        console.log(`Image fetch failed for ${url}: ${upstream.status} ${upstream.statusText}`);
        // Return a placeholder image instead of failing
        const placeholderSvg = `<svg width="300" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#374151"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="16">Movie Poster</text></svg>`;
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        return res.status(200).send(placeholderSvg);
      }

      const contentType = upstream.headers.get('content-type') || '';
      if (!contentType.startsWith('image/')) {
        console.log(`Non-image content type for ${url}: ${contentType}`);
        // Return placeholder for non-image content
        const placeholderSvg = `<svg width="300" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#374151"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="16">Movie Poster</text></svg>`;
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        return res.status(200).send(placeholderSvg);
      }
      
      res.setHeader('Content-Type', contentType);
      const cacheControl = upstream.headers.get('cache-control') || 'public, max-age=86400';
      res.setHeader('Cache-Control', cacheControl);

      const ab = await upstream.arrayBuffer();
      res.status(200).end(Buffer.from(ab));
    } catch (err) {
      console.log(`Proxy error for ${req.query.url}:`, err);
      // Return placeholder on any error
      const placeholderSvg = `<svg width="300" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#374151"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="16">Movie Poster</text></svg>`;
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.status(200).send(placeholderSvg);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

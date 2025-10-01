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

      const upstream = await fetch(target.toString(), {
        // Some CDNs are picky about headers; keep minimal
        headers: {
          'User-Agent': 'MoviePulse-Image-Proxy',
          'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
          'Referer': 'https://en.wikipedia.org/',
        },
      });

      if (!upstream.ok) {
        return res.status(502).json({ message: 'Upstream fetch failed' });
      }

      const contentType = upstream.headers.get('content-type') || '';
      if (!contentType.startsWith('image/')) {
        return res.status(502).json({ message: 'Upstream did not return an image' });
      }
      res.setHeader('Content-Type', contentType);
      const cacheControl = upstream.headers.get('cache-control') || 'public, max-age=86400';
      res.setHeader('Cache-Control', cacheControl);

      const ab = await upstream.arrayBuffer();
      res.status(200).end(Buffer.from(ab));
    } catch (err) {
      res.status(500).json({ message: 'Proxy error' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

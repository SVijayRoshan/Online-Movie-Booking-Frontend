// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
async function registerRoutes(app2) {
  app2.get("/api/proxy", async (req, res) => {
    try {
      const url = req.query.url;
      if (!url) {
        return res.status(400).json({ message: "Missing url parameter" });
      }
      const allowedHosts = [
        "upload.wikimedia.org",
        "static.wikia.nocookie.net",
        "image.tmdb.org",
        "m.media-amazon.com"
      ];
      const target = new URL(url);
      if (!allowedHosts.includes(target.hostname)) {
        return res.status(400).json({ message: "Host not allowed" });
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1e4);
      const headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        // For Wikimedia, set referer to en.wikipedia.org to avoid edge oddities; otherwise use origin
        "Referer": target.hostname === "upload.wikimedia.org" ? "https://en.wikipedia.org/" : target.origin,
        "Accept-Language": "en-US,en;q=0.5"
      };
      const upstream = await fetch(target.toString(), {
        // Some CDNs are picky about headers; keep minimal
        headers,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!upstream.ok) {
        console.log(`Image fetch failed for ${url}: ${upstream.status} ${upstream.statusText}`);
        const placeholderSvg = `<svg width="300" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#374151"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="16">Movie Poster</text></svg>`;
        res.setHeader("Content-Type", "image/svg+xml");
        res.setHeader("Cache-Control", "public, max-age=3600");
        return res.status(200).send(placeholderSvg);
      }
      const contentType = upstream.headers.get("content-type") || "";
      if (!contentType.startsWith("image/")) {
        console.log(`Non-image content type for ${url}: ${contentType}`);
        const placeholderSvg = `<svg width="300" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#374151"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="16">Movie Poster</text></svg>`;
        res.setHeader("Content-Type", "image/svg+xml");
        res.setHeader("Cache-Control", "public, max-age=3600");
        return res.status(200).send(placeholderSvg);
      }
      res.setHeader("Content-Type", contentType);
      const cacheControl = upstream.headers.get("cache-control") || "public, max-age=86400";
      res.setHeader("Cache-Control", cacheControl);
      const ab = await upstream.arrayBuffer();
      res.status(200).end(Buffer.from(ab));
    } catch (err) {
      console.log(`Proxy error for ${req.query.url}:`, err);
      const placeholderSvg = `<svg width="300" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#374151"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="16">Movie Poster</text></svg>`;
      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "public, max-age=3600");
      return res.status(200).send(placeholderSvg);
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5002", 10);
  const shouldReusePort = process.platform !== "darwin";
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: shouldReusePort
  }, () => {
    log(`serving on port ${port}`);
  });
})();

import express from "express";
import rateLimit from "express-rate-limit";
import cartRoutes from "./routes/cartRoutes.js";
import { client, httpRequestDurationMicroseconds } from "./utils/metrics.js";

const app = express();
app.use(express.json());

// Metrics middleware
app.use((req, res, next) => {
  const startHrTime = process.hrtime();

  res.on("finish", () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

    httpRequestDurationMicroseconds
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(elapsedMs);
  });

  next();
});

// Prometheus metrics endpoint
app.get("/api/carts/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// Behind the ingress, use the client IP from X-Forwarded-For.
app.set("trust proxy", 1);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

// API routes
app.use("/api/carts", apiLimiter, cartRoutes);

export default app;

import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  env: process.env.NODE_ENV || "development",
  frontendUrls:
    process.env.FRONTEND_URL === "*"
      ? "*"
      : (process.env.FRONTEND_URL || "http://localhost:3001")
          .split(",")
          .map((u) => u.trim()),
}));

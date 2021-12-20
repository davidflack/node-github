import { Router } from "express";
import healthCheckHandler from "./healthCheck";
import githubHandler from "./github";

const apiRoutes = Router();

export default apiRoutes
  .get("/healthcheck", healthCheckHandler)
  .get("/github", githubHandler);

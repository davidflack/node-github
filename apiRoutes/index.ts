import { Router } from "express";
import healthCheckHandler from "./healthCheck";

const apiRoutes = Router();

export default apiRoutes.get("/healthcheck", healthCheckHandler);

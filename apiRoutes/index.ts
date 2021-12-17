import express from "express";
import healthCheckRouter from "./healthCheck";

const apiRoutes = express.Router();

export default apiRoutes.get("/healthcheck", healthCheckRouter);

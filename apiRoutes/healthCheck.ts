import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

function serverHealthCheck(req: Request, res: Response, next: NextFunction) {
  res.status(200).send({ message: "Server is working!" });
}

export default router.get("/healthcheck", serverHealthCheck);

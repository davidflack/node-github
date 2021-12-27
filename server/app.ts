import express, { Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";

import apiRoutes from "./apiRoutes";

const app = express()
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(helmet())
  .use(morgan("dev"))
  .use("/api", apiRoutes)
  .use(notFoundHandler);

function notFoundHandler(request: Request, response: Response) {
  response.status(404).send({
    status: 404,
    message: "The requested resource was not found.",
    url: request.originalUrl,
  });
}

export default app;

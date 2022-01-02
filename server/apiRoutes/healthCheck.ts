import { Request, Response, NextFunction } from "express";

function healthCheckHandler(req: Request, res: Response, next: NextFunction) {
  res.status(200).send({ message: "Server is working!" });
}

export default healthCheckHandler;

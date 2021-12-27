import { Request, Response, NextFunction } from "express";
import { validateRequest, requestPRInfo, requestCommitInfo } from "./helpers";

function githubRepoHandler(req: Request, res: Response, next: NextFunction) {
  validateRequest(req)
    .then(requestPRInfo)
    .then(requestCommitInfo)
    .then((commitData) => {
      res.status(200).send({ commitData });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send({ status: 400, error });
    });
}

export default githubRepoHandler;

import { Request, Response } from "express";
import {
  validateRequest,
  requestPRInfo,
  requestCommitInfo,
  extractErrorStatusCode,
} from "./helpers";

function githubRepoHandler(req: Request, res: Response) {
  validateRequest(req)
    .then(requestPRInfo)
    .then(requestCommitInfo)
    .then((commitData) => {
      res.status(200).send({ commitData });
    })
    .catch((error) => {
      console.error(error);
      const status = extractErrorStatusCode(error);
      res.status(status).send({ status, error: error.message });
    });
}

export default githubRepoHandler;

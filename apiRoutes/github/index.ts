import { Request, Response } from "express";
import { validateRequest, requestPRInfo, requestCommitInfo } from "./helpers";

function githubRepoHandler(req: Request, res: Response) {
  validateRequest(req)
    .then(requestPRInfo)
    .then(requestCommitInfo)
    .then((commitData) => {
      res.status(200).send({ commitData });
    })
    .catch((error: Error) => {
      console.error(error);
      res.status(400).send({ status: 400, error: error.message });
    });
}

export default githubRepoHandler;

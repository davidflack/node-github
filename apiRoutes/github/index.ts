import { Request, Response, NextFunction } from "express";
import {
  validateRequest,
  requestPRInfo,
  convertPRNumbersToUrls,
  convertUrlsToAxiosRequests,
  requestCommitDetails,
  calculateCommitNumber,
} from "./helpers";

function githubRepoHandler(req: Request, res: Response, next: NextFunction) {
  const { repoOwner, repoName } = req.query;

  validateRequest(req)
    .then(requestPRInfo)
    .then(convertPRNumbersToUrls)
    .then(convertUrlsToAxiosRequests)
    .then(requestCommitDetails)
    .then(calculateCommitNumber)
    .then((commitData) => {
      res.status(200).send({ commitData });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send({ status: 400, error });
    });
}

export default githubRepoHandler;

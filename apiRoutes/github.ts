import { AxiosResponse } from "axios";
import { Request, Response, NextFunction } from "express";
import { axiosInstance as axios } from "../config";

function githubRepoHandler(req: Request, res: Response, next: NextFunction) {
  const { repoOwner, repoName } = req.query;
  const url = `/${repoOwner}/${repoName}/pulls`;
  axios
    .get(url)
    .then(convertPRNumbersToUrls.bind(null, url))
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

interface GithubPullRequest {
  number: number;
}

function convertPRNumbersToUrls(
  url: string,
  response: AxiosResponse<GithubPullRequest[], any>
): string[] {
  return response.data.map((pr) => url + `/${pr.number}/commits`);
}

function convertUrlsToAxiosRequests(urls: string[]) {
  return urls.map((url) => axios.get(url));
}

function requestCommitDetails(urls: Promise<AxiosResponse<any, any>>[]) {
  return Promise.all(urls);
}

function calculateCommitNumber(githubResponses: AxiosResponse[]) {
  return githubResponses.map((res) => res.data);
}

export default githubRepoHandler;

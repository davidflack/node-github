import { AxiosResponse } from "axios";
import { Request } from "express";
import { axiosInstance as axios } from "../../config";

interface GithubPullRequest {
  number: number;
}

type GithubQueryParams = {
  repoOwner: any;
  repoName: any;
};

export function validateRequest(req: Request): Promise<GithubQueryParams> {
  return new Promise((resolve, reject) => {
    if (!req.query.repoOwner || !req.query.repoName) {
      reject(
        'Query parameters "repoOwner" (string) and "repoName" (string) are required.'
      );
    } else {
      resolve({ repoOwner: req.query.repoOwner, repoName: req.query.repoName });
    }
  });
}

export function requestPRInfo({ repoOwner, repoName }: GithubQueryParams) {
  return axios.get(`/${repoOwner}/${repoName}/pulls`);
}

export function convertPRNumbersToUrls(
  url: string,
  response: AxiosResponse<GithubPullRequest[], any>
): string[] {
  return response.data.map((pr) => url + `/${pr.number}/commits`);
}

export function convertUrlsToAxiosRequests(urls: string[]) {
  return urls.map((url) => axios.get(url));
}

export function requestCommitDetails(urls: Promise<AxiosResponse<any, any>>[]) {
  return Promise.all(urls);
}

export function calculateCommitNumber(githubResponses: AxiosResponse[]) {
  return githubResponses.map((res) => res.data);
}
